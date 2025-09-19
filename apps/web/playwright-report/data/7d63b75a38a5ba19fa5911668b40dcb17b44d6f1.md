# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Skip to main content" [ref=e2] [cursor=pointer]:
    - /url: "#main-content"
  - generic [ref=e3]:
    - generic [ref=e4]:
      - generic [ref=e5]:
        - navigation [ref=e6]:
          - link "Home" [ref=e7] [cursor=pointer]:
            - /url: /
          - link "About" [ref=e8] [cursor=pointer]:
            - /url: /about
          - link "Pricing" [ref=e9] [cursor=pointer]:
            - /url: /pricing
          - link "Dashboard" [ref=e10] [cursor=pointer]:
            - /url: /dashboard
        - button "Toggle theme" [ref=e12]:
          - img
          - img
          - generic [ref=e13]: Toggle theme
      - separator [ref=e14]
    - main [ref=e15]
  - region "Notifications alt+T"
  - button "Open Next.js Dev Tools" [ref=e45] [cursor=pointer]:
    - img [ref=e46] [cursor=pointer]
  - alert [ref=e49]
```