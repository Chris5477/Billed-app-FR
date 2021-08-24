import WindowIcon from "../assets/svg/window.js";
import MailIcon from "../assets/svg/mail.js";
import DisconnectIcon from "../assets/svg/disconnect.js";
import { ROUTES_PATH } from "../constants/routes.js";

export default (height) => {
  let user;
  user = JSON.parse(localStorage.getItem("user"));
  if (typeof user === "string") {
    user = JSON.parse(user);
  }
  if (user && user.type === "Employee" && window.location.origin + ROUTES_PATH["Bills"]) {
    return `
        <div class='vertical-navbar' style='height: ${height}vh;'>
          <div class='layout-title'> Billed </div>
          <div id='layout-icon1' data-testid="icon-window" class="active-icon">
            ${WindowIcon}
          </div>
          <div id='layout-icon2' data-testid="icon-mail">
            ${MailIcon}
          </div>
          <div id='layout-disconnect'>
            ${DisconnectIcon}
          </div>
      </div>
        `;
  } else if (window.location.origin + ROUTES_PATH["NewBill"]) {
    return `
        <div class='vertical-navbar' style='height: ${height}vh;'>
        <div class='layout-title'> Billed </div>
        <div id='layout-icon1' data-testid="icon-window">
          ${WindowIcon}
        </div>
        <div id='layout-icon2' data-testid="icon-mail" class="active-icon">
          ${MailIcon}
        </div>
        <div id='layout-disconnect'>
          ${DisconnectIcon}
        </div>
    </div>
        `;
  }
};

