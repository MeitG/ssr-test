import { UserInfo, RenderOptions } from "./utils/types";

// Helper function to generate the HTML head section
const renderHead = (title: string = 'Document', styles: string[] = [], scripts: string[] = []) => {
  const styleLinks = styles.map(style => `<link rel="stylesheet" href="${style}">`).join('\n    ');
  const scriptLinks = scripts.map(script => `<script src="${script}"></script>`).join('\n    ');
  
  return `
  <head>
    <title>${title}</title>
    ${styleLinks}
    ${scriptLinks}
  </head>`;
};

// Single exported render function that can generate complete HTML
const render = (content: string, options: RenderOptions = {}) => {
  const { title = 'Document', styles = [], scripts = [] } = options;
  
  return `<!DOCTYPE html>
<html lang="en">
${renderHead(title, styles, scripts)}
<body>
  ${content}
</body>
</html>`;
};

// Example of how to use the render function (not exported)
const renderProfile = (user: UserInfo) => {
  const profileContent = `
    <div class="profile-container">
      <div class="profile-header">
        <div class="profile-avatar" id="profile-avatar">JD</div>
        <h1 class="profile-title">User Profile</h1>
        <p class="profile-subtitle">Your personal information</p>
      </div>
      
      <div class="profile-info">
        <div class="info-item">
          <div class="info-label">Full Name:</div>
          <div class="info-value" id="user-fullname">${user.fullname}</div>
        </div>
        
        <div class="info-item">
          <div class="info-label">Email:</div>
          <div class="info-value" id="user-email">${user.email}</div>
        </div>
        
        <div style="text-align: center;">
          <button class="edit-btn">Edit Profile</button>
          <button class="logout-btn" id="logout-btn">Logout</button>
        </div>
      </div>
    </div>`;
  
  return render(profileContent, {
    title: 'Profile',
    styles: ['/styles/profile.css', '/styles/navbar.css'],
    scripts: ['/scripts/navbar.js', '/scripts/profile.js']
  });
};

export default render;