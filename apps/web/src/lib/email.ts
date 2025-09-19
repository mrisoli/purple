import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  console.warn('RESEND_API_KEY is not set. Email functionality will be disabled.');
}

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface BuddyInvitationEmailData {
  buddyEmail: string;
  buddyName?: string;
  inviterName: string;
  projectName: string;
  projectDescription: string;
  inviteLink: string;
}

export async function sendBuddyInvitationEmail(data: BuddyInvitationEmailData) {
  if (!resend) {
    console.warn('Resend not configured. Skipping email send.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const { buddyEmail, buddyName, inviterName, projectName, projectDescription, inviteLink } = data;

    const subject = `${inviterName} invited you to be their accountability buddy`;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Accountability Buddy Invitation</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #6366f1; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .project-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6366f1; }
            .cta-button { display: inline-block; background: #6366f1; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 You've Been Invited!</h1>
              <p>Be an accountability buddy and help achieve great things</p>
            </div>
            
            <div class="content">
              <p>Hello${buddyName ? ` ${buddyName}` : ''},</p>
              
              <p><strong>${inviterName}</strong> has invited you to be their accountability buddy for an exciting project!</p>
              
              <div class="project-details">
                <h3>📋 Project: ${projectName}</h3>
                <p>${projectDescription}</p>
              </div>
              
              <p>As an accountability buddy, you'll:</p>
              <ul>
                <li>Help keep ${inviterName} motivated and on track</li>
                <li>See their progress updates and celebrate milestones</li>
                <li>Provide encouragement during challenging times</li>
                <li>Share in the success when goals are achieved</li>
              </ul>
              
              <p>Ready to make a difference in someone's journey?</p>
              
              <div style="text-align: center;">
                <a href="${inviteLink}" class="cta-button">Accept Invitation</a>
              </div>
              
              <p><em>If you don't have an account yet, you'll be able to create one when you click the link above.</em></p>
            </div>
            
            <div class="footer">
              <p>This invitation was sent by ${inviterName} via Purple - Accountability Buddy Network</p>
              <p>If you don't want to receive these emails, you can safely ignore this message.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const textContent = `
      You've Been Invited to Be an Accountability Buddy!

      Hello${buddyName ? ` ${buddyName}` : ''},

      ${inviterName} has invited you to be their accountability buddy for their project: "${projectName}"

      Project Description: ${projectDescription}

      As an accountability buddy, you'll help keep ${inviterName} motivated, see their progress updates, and celebrate their milestones together.

      Accept the invitation: ${inviteLink}

      If you don't have an account yet, you'll be able to create one when you click the link above.

      This invitation was sent by ${inviterName} via Purple - Accountability Buddy Network.
    `;

    const result = await resend.emails.send({
      from: 'Purple <noreply@purple.app>',
      to: [buddyEmail],
      subject,
      html: htmlContent,
      text: textContent,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending buddy invitation email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    };
  }
}

interface WelcomeEmailData {
  userEmail: string;
  userName: string;
}

export async function sendWelcomeEmail(data: WelcomeEmailData) {
  if (!resend) {
    console.warn('Resend not configured. Skipping welcome email send.');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const { userEmail, userName } = data;

    const subject = `Welcome to Purple - Your Accountability Journey Starts Now! 🎯`;
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Purple</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #6366f1; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .tips { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .cta-button { display: inline-block; background: #6366f1; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to Purple!</h1>
              <p>Your accountability journey starts here</p>
            </div>
            
            <div class="content">
              <p>Hi ${userName},</p>
              
              <p>Welcome to Purple! We're excited to help you turn your goals into achievements through the power of accountability partnerships.</p>
              
              <div class="tips">
                <h3>🚀 Ready to get started? Here's what to do next:</h3>
                <ol>
                  <li><strong>Create your first project</strong> - Define a goal you want to achieve</li>
                  <li><strong>Invite an accountability buddy</strong> - Choose someone who will support and motivate you</li>
                  <li><strong>Start logging progress</strong> - Share updates, milestones, and challenges</li>
                  <li><strong>Stay consistent</strong> - Regular check-ins lead to better results</li>
                </ol>
              </div>
              
              <p>Remember, accountability isn't about judgment - it's about support, encouragement, and celebrating progress together.</p>
              
              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://purple.app'}/dashboard" class="cta-button">Start Your First Project</a>
              </div>
            </div>
            
            <div class="footer">
              <p>Need help? We're here to support you on your journey.</p>
              <p>Happy goal achieving!</p>
              <p>- The Purple Team</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: 'Purple <welcome@purple.app>',
      to: [userEmail],
      subject,
      html: htmlContent,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    };
  }
}