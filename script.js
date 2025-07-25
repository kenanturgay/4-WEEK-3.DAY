(() => {
  if (typeof jQuery === "undefined") {
    const script = document.createElement("script");
    script.src = "https://code.jquery.com/jquery-3.7.1.min.js";
    script.type = "text/javascript";
    script.onload = () => {
      startApp(jQuery);
    };
    document.head.appendChild(script);
  } else {
    startApp(jQuery);
  }

  const startApp = ($) => {
    (($) => {
      "use strict";

      const classes = {
        style: "custom-style",
        wrapper: "custom-wrapper",
        userCard: "user-card",
        deleteBtn: "delete-btn",
        errorBox: "error-box",
        popup: "popup-overlay",
        popupBox: "popup-box",
        spinner: "spinner",
        usersTitle: "users-title",
        reloadBtn: "reload-btn",
      };

      const selectors = {
        style: `.${classes.style}`,
        wrapper: `.${classes.wrapper}`,
        userCard: `.${classes.userCard}`,
        deleteBtn: `.${classes.deleteBtn}`,
        errorBox: `.${classes.errorBox}`,
        popup: `.${classes.popup}`,
        popupBox: `.${classes.popupBox}`,
        usersTitle: `.${classes.usersTitle}`,
        spinner: `.${classes.spinner}`,
        reloadBtn: `.${classes.reloadBtn}`,
        appendLocation: ".ins-api-users",
      };

      const self = {
        users: [],
        storageKey: "users",
      };

      self.init = () => {
        self.buildCSS();
        self.loadFromStorage();
        self.observeChanges();
      };

      self.buildCSS = () => {
        const styleHTML = `
        <style class="${classes.style}">
        :root {
            /* Colors */
            --color-primary: #4CAF50;
            --color-text: #1ada2a;
            --color-bg-start: #3708f3;
            --color-bg-end: #17c923;
            --color-btn: #f80505af;
            --color-btn-hover: #ff0000;
            --color-border: #40fca4;
            --color-card-start: #89c8ff;
            --color-card-end: #56fce0;
            --color-heading: #2c3e50;
            --color-paragraph: #444;
            --color-error: red;
            --color-shadow: rgba(0, 0, 0, 0.05);
            --color-card-hover-shadow: rgba(255, 0, 0, 1);

            /* Typography */
            --font-size-base: 16px;
            --font-size-heading: 20px;
            --font-size-paragraph: 15px;
            --font-family-base: Arial, sans-serif;
            --font-family-cards: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

            /* Layout & Radius */
            --radius: 6px;

            /* Effects */
            --transition-default: 0.2s ease;
            --box-shadow-light: 0 4px 12px var(--color-shadow);
            }

            * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            }

            body {
            font-family: var(--font-family-base);
            font-size: var(--font-size-base);
            color: var(--color-text);
            background: linear-gradient(90deg, var(--color-bg-start), var(--color-bg-end));
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            }

            .ins-api-users {
            width: 100%;
            padding: 20px;
            display: flex;
            justify-content: center;
            flex-direction: column;
            align-items: center;
            }

            .${classes.wrapper} {
            display: flex;
            flex-direction: row;
            justify-content: center;
            flex-wrap: wrap;
            gap: 20px;
            width: clamp(200px, 100%, 900px);
            max-height: 600px;
            overflow-y: auto;
            padding: 20px;

            background: linear-gradient(130deg, var(--color-bg-end), var(--color-bg-start));
            border: 1px solid var(--color-border);
            border-radius: var(--radius);
            box-shadow: var(--box-shadow-light);
            }

            .${classes.userCard} {
            background: linear-gradient(135deg, var(--color-card-start), var(--color-card-end));
            font-family: var(--font-family-cards);
            color: #333;
            border: 1px solid var(--color-border);
            border-radius: var(--radius);
            padding: 15px;
            width: 300px;
            box-shadow: var(--box-shadow-light);
            position: relative;
            transition: transform var(--transition-default), box-shadow var(--transition-default);
            }

            .${classes.userCard}:hover {
            transform: scale(1.02);
            box-shadow: 0 0 16px var(--color-card-hover-shadow);
            }

            .${classes.userCard} h3 {
            font-size: var(--font-size-heading);
            margin-bottom: 8px;
            color: var(--color-heading);
            }

            .${classes.userCard} p {
            font-size: var(--font-size-paragraph);
            line-height: 1.5;
            color: var(--color-paragraph);
            margin-bottom: 5px;
            }

            .${classes.deleteBtn} {
            position: absolute;
            top: 10px;
            right: 10px;
            background-color: var(--color-btn);
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: var(--radius);
            cursor: pointer;
            }

            .${classes.deleteBtn}:hover {
            background-color: var(--color-btn-hover);
            }

            .${classes.errorBox} {
            color: var(--color-error);
            font-weight: bold;
            padding: 10px;
            }

            .${classes.popup} {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(8px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999;
            }
            

        .${classes.popupBox} {
            background: white;
            padding: 25px;
            border-radius: var(--radius);
            box-shadow: 0 0 20px rgba(0,0,0,0.2);
            transform: scale(1.05);
            transition: transform var(--transition-default);
            position: relative;
        }

        .${classes.usersTitle}{
        
            width: 100%;
            text-align: center;
            margin-bottom: 20px;
            color: var(--color-text);
            font-family: var(--font-family-base);
        }

        .${classes.spinner} {
            width: 40px;
            height: 40px;
            margin: 20px auto;
            border: 5px solid #f3f3f3;
            border-top: 5px solid #3498db;
            border-radius: 50%;
            animation: rotate 1s linear infinite;
            }
            @keyframes rotate {
            0% { transform: rotate(0); }
            100% { transform: rotate(360deg); }
            }
        .${classes.reloadBtn} {
            background-color: var(--color-btn);
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: var(--radius);
            cursor: pointer;
            font-size: var(--font-size-base);
            transition: background-color var(--transition-default);
            z-index: 1000;
        }


        </style>

        `;
        $("head").append(styleHTML);
        document.title = "Users";

       
        if (!$("link[rel='icon']").length) {
          const favicon = document.createElement("link");
          favicon.rel = "icon";
          favicon.href =
            "https://cdn-icons-png.flaticon.com/512/747/747376.png";
          favicon.type = "image/png";
          document.head.appendChild(favicon);
        }
      };

      self.fetchData = async () => {
        try {
          $(selectors.appendLocation).html(
            `<div class="${classes.spinner}"></div>`
          );
          const response = await fetch(
            "https://jsonplaceholder.typicode.com/users"
          );

          const data = await response.json();
          self.users = data;
          self.saveToStorage();
          self.buildHTML();
        } catch (err) {
          console.error("Fetch Error:", err);
          const errorBox = `<div class="${classes.errorBox}">When fetching data: ${err.message}</div>`;
          $(selectors.appendLocation).html(errorBox);
        }
      };

      self.saveToStorage = () => {
        const data = {
          users: self.users,
          time: new Date().getTime(),
        };
        localStorage.setItem(self.storageKey, JSON.stringify(data));
      };

      self.loadFromStorage = () => {
        const storedUsers = localStorage.getItem(self.storageKey);
        const now = new Date().getTime();

        if (storedUsers) {
          const parsedData = JSON.parse(storedUsers);
          const timeDiff = now - parsedData.time;

          if (timeDiff < 86400000) {
            self.users = parsedData.users;
            self.buildHTML();
            return;
          }
        }

        self.fetchData();
      };

      self.showReloadButton = () => {
        if (sessionStorage.getItem("reloadUsed") === "true") return;
        if ($(selectors.reloadBtn).length > 0) return;
        const reloadBtn = $(
          `<button class="${classes.reloadBtn}">Reload</button>`
        );
        reloadBtn.on("click", () => {
          sessionStorage.setItem("reloadUsed", "true");

          if (self.observer) self.observer.disconnect();
          $(selectors.wrapper).remove();
          self.fetchData();
          self.hideReloadButton();
        });
        $(selectors.wrapper).append(reloadBtn);
      };

      self.hideReloadButton = () => {
        $(selectors.reloadBtn).remove();
      };

      self.observeChanges = () => {
        const wrapper = document.querySelector(selectors.wrapper);
        if (!wrapper) return;
        if (self.observer) self.observer.disconnect();
        self.observer = new MutationObserver(() => {
          if ($(selectors.userCard).length === 0) {
            self.showReloadButton();
          }
        });
        self.observer.observe(wrapper, {
          childList: true,
          subtree: true,
        });
      };

      self.buildHTML = () => {
        self.hideReloadButton();
        const container = $(`<div class="${classes.wrapper}"></div>`);

        if (self.users.length === 0) {
          container.append(
            `<div class="${classes.errorBox}">Users not found</div>`
          );
        }

        self.users.forEach((user) => {
          const userHTML = $(`
            <div class="${classes.userCard}" data-id="${user.id}">
            <button class="${classes.deleteBtn}">Delete</button>
            <h3>${user.name}</h3>
            <p><strong>Email:</strong> <a href="mailto:${user.email}">${user.email}</a></p>
            <p><strong>Adress:</strong> ${user.address.street}, ${user.address.city}</p>
            <p><strong>Phone:</strong> <a href="tel:${user.phone}">${user.phone}</a></p>
            <p><strong>Website:</strong> <a href="http://${user.website}" target="_blank">${user.website}</a></p>
            </div>
        `);
          container.append(userHTML);
        });

        const title = $(`<h1 class="${classes.usersTitle}">Users</h1>`);
        $(selectors.appendLocation).html("");
        $(selectors.appendLocation).append(title, container);

        if (self.users.length === 0) {
          self.showReloadButton();
        }

        self.setEvents();
        self.observeChanges();
      };

      self.setEvents = () => {
        $(document).off("click", selectors.deleteBtn);
        $(document).off("click", selectors.reloadBtn);
        $(document).off("click", `.${classes.popup}`);
        $(selectors.userCard).off("click");

        $(document).on("click", selectors.deleteBtn, (e) => {
          const id = $(e.currentTarget).closest(selectors.userCard).data("id");
          self.users = self.users.filter((user) => user.id !== id);
          self.saveToStorage();
          self.buildHTML();

          $(`.${classes.popup}`).remove();
        });

        $(selectors.userCard).on("click", (e) => {
          if ($(e.target).is(selectors.deleteBtn)) return;

          const clone = $(this).clone();
          const overlay = $(`
        <div class="${classes.popup}">
            <div class="${classes.popupBox}"></div>
        </div>
        `);

          overlay.find(`.${classes.popupBox}`).append(clone);
          $("body").append(overlay);
        });

        $(document).on("click", `.${classes.popup}`, (e) => {
          if ($(e.target).hasClass(classes.popup)) {
            $(e.currentTarget).remove();
          }
        });
        $(document).on("click", selectors.reloadBtn, () => {
          self.fetchData();
          self.hideReloadButton();
        });
      };

      $(document).ready(self.init);
    })($);
  };
})();
