import { auth } from '@clerk/nextjs/server';
import { api } from '@purple/backend/convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';
import { type NextRequest, NextResponse } from 'next/server';
import { sendBuddyInvitationEmail } from '@/lib/email';

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, buddyEmail } = body;

    if (!(projectId && buddyEmail)) {
      return NextResponse.json(
        { error: 'Project ID and buddy email are required' },
        { status: 400 }
      );
    }

    // Get project details and user info from Convex
    const [project, currentUser] = await Promise.all([
      convex.query(api.projects.get, { projectId }),
      convex.query(
        api.users.current,
        {},
        { jwt: await fetch('/api/convex-jwt').then((r) => r.text()) }
      ),
    ]);

    if (!(project && currentUser)) {
      return NextResponse.json(
        { error: 'Project or user not found' },
        { status: 404 }
      );
    }

    // Check if current user owns this project
    if (project.ownerId !== currentUser._id) {
      return NextResponse.json(
        { error: 'Only project owner can send invitations' },
        { status: 403 }
      );
    }

    // Check if buddy user exists
    const buddyUser = await convex.query(api.users.findByEmail, {
      email: buddyEmail,
    });

    // Create invitation link
    const inviteLink = buddyUser
      ? `${request.headers.get('origin')}/projects/${projectId}?invited=true`
      : `${request.headers.get('origin')}/sign-up?invite=${projectId}&email=${encodeURIComponent(buddyEmail)}`;

    // Send buddy invitation email
    const emailResult = await sendBuddyInvitationEmail({
      buddyEmail,
      buddyName: buddyUser?.name,
      inviterName: currentUser.name,
      projectName: project.name,
      projectDescription: project.description,
      inviteLink,
    });

    if (!emailResult.success) {
      console.error(
        'Failed to send buddy invitation email:',
        emailResult.error
      );
      return NextResponse.json(
        { error: 'Failed to send invitation email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Buddy invitation sent successfully',
      hasAccount: !!buddyUser,
    });
  } catch (error) {
    console.error('Error sending buddy invitation:', error);
    return NextResponse.json(
      { error: 'Failed to send invitation' },
      { status: 500 }
    );
  }
}
