import { UserInfo } from "../utils/types";

 const Profile = (user : UserInfo) => {
    function render(){
        return `
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
    </div>
        `
    }
    return {render};
}

export default Profile;