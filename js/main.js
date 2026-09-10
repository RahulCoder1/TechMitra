
(function () {
  "use strict";

  var prefersReduced = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function initHeader() {
    var header = document.getElementById("siteHeader");
    if (!header) return;

    var toggle = function () {
      if (window.scrollY > 40) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    };
    toggle();
    window.addEventListener("scroll", toggle, { passive: true });
  }

  function initMobileNav() {
    var toggle = document.getElementById("navToggle");
    var nav = document.getElementById("mainNav");
    var backdrop = document.getElementById("navBackdrop");
    if (!toggle || !nav) return;

    var open = function () {
      nav.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
      if (backdrop) { backdrop.hidden = false; requestAnimationFrame(function () { backdrop.classList.add("is-open"); }); }
    };
    var close = function () {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      if (backdrop) {
        backdrop.classList.remove("is-open");
        window.setTimeout(function () { backdrop.hidden = true; }, 380);
      }
    };

    toggle.addEventListener("click", function () {
      if (nav.classList.contains("is-open")) close();
      else open();
    });

    if (backdrop) backdrop.addEventListener("click", close);

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", close);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        close();
        toggle.focus();
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900 && nav.classList.contains("is-open")) close();
    });
  }

  function initSmoothScroll() {
    var links = document.querySelectorAll('a[href^="#"]');
    if (!links.length) return;

    links.forEach(function (link) {
      link.addEventListener("click", function (e) {
        var id = link.getAttribute("href");
        if (!id || id === "#" || id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({
          behavior: prefersReduced ? "auto" : "smooth",
          block: "start"
        });
      });
    });
  }

  function initPortfolioFilter() {
    var group = document.getElementById("projectFilters");
    var grid = document.getElementById("projectsGrid");
    if (!group || !grid) return;

    var buttons = group.querySelectorAll(".filter-btn");
    var items = grid.querySelectorAll(".project");
    var empty = document.getElementById("filterEmpty");

    group.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter-btn");
      if (!btn) return;

      buttons.forEach(function (b) {
        b.classList.remove("is-active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-pressed", "true");

      var filter = btn.getAttribute("data-filter");
      var shown = 0;

      items.forEach(function (item) {
        var match = filter === "all" || item.getAttribute("data-category") === filter;
        if (match) {
          item.classList.remove("is-hidden");
          shown++;
        } else {
          item.classList.add("is-hidden");
        }
      });

      if (empty) empty.hidden = shown !== 0;
    });
  }

  function initProductSlider() {
    var track = document.getElementById("productsTrack");
    var prev = document.getElementById("prodPrev");
    var next = document.getElementById("prodNext");
    if (!track || !prev || !next) return;

    var step = function () {
      var card = track.querySelector(".product");
      var w = card ? card.getBoundingClientRect().width : 300;
      return w + 22; // card width + gap
    };

    prev.addEventListener("click", function () {
      track.scrollBy({ left: -step(), behavior: prefersReduced ? "auto" : "smooth" });
    });
    next.addEventListener("click", function () {
      track.scrollBy({ left: step(), behavior: prefersReduced ? "auto" : "smooth" });
    });
  }

  function initTestimonials() {
    var viewport = document.getElementById("tstViewport");
    var dotsWrap = document.getElementById("tstDots");
    var prev = document.getElementById("tstPrev");
    var next = document.getElementById("tstNext");
    if (!viewport) return;

    var slides = Array.prototype.slice.call(viewport.querySelectorAll(".tst__slide"));
    if (slides.length < 2) return;

    var index = 0;
    var timer = null;

    var dots = [];
    if (dotsWrap) {
      slides.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.className = "tst__dot" + (i === 0 ? " is-active" : "");
        dot.setAttribute("aria-label", "Go to testimonial " + (i + 1));
        dot.addEventListener("click", function () { go(i, true); });
        dotsWrap.appendChild(dot);
        dots.push(dot);
      });
    }

    function go(i, userAction) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, si) { s.classList.toggle("is-active", si === index); });
      dots.forEach(function (d, di) { d.classList.toggle("is-active", di === index); });
      if (userAction) restart();
    }

    function nextSlide() { go(index + 1); }

    function restart() {
      if (prefersReduced) return;
      if (timer) window.clearInterval(timer);
      timer = window.setInterval(nextSlide, 6500);
    }

    if (prev) prev.addEventListener("click", function () { go(index - 1, true); });
    if (next) next.addEventListener("click", function () { go(index + 1, true); });

 
    viewport.addEventListener("mouseenter", function () { if (timer) window.clearInterval(timer); });
    viewport.addEventListener("mouseleave", restart);

    restart();
  }

  function initReveal() {
    var els = document.querySelectorAll("[data-reveal]");
    if (!els.length) return;

    if (prefersReduced || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    els.forEach(function (el) { io.observe(el); });
  }

  function initContactForm() {
    var form = document.getElementById("contactForm");
    if (!form) return;

    var success = document.getElementById("formSuccess");
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setError(field, on) {
      var row = field.closest(".form-row") || field.parentElement;
      if (!row) return;
      row.classList.toggle("has-error", on);
    }

    function validateField(field) {
      var val = (field.value || "").trim();
      var ok = true;
      if (field.hasAttribute("required") && !val) ok = false;
      else if (field.type === "email" && !emailRe.test(val)) ok = false;
      else if (field.id === "cf-message" && val.length < 10) ok = false;
      setError(field, !ok);
      return ok;
    }

    var fields = form.querySelectorAll("[required]");

    fields.forEach(function (field) {
      field.addEventListener("blur", function () { validateField(field); });
      field.addEventListener("input", function () {
        var row = field.closest(".form-row");
        if (row && row.classList.contains("has-error")) validateField(field);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var valid = true;
      var firstBad = null;
      fields.forEach(function (field) {
        if (!validateField(field)) {
          valid = false;
          if (!firstBad) firstBad = field;
        }
      });

      if (!valid) {
        if (firstBad) firstBad.focus();
        if (success) success.classList.remove("show");
        return;
      }

      if (success) success.classList.add("show");
      form.reset();
      window.setTimeout(function () {
        if (success) success.classList.remove("show");
      }, 6000);
    });
  }

  function initNewsletter() {
    var form = document.getElementById("newsForm");
    if (!form) return;
    var input = form.querySelector("input[type='email']");
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!input) return;
      var val = (input.value || "").trim();
      if (!emailRe.test(val)) {
        input.focus();
        input.style.borderColor = "#C6A56A";
        return;
      }
      input.value = "";
      input.placeholder = "Thank you — you're on the list";
    });
  }

  function boot() {
    initHeader();
    initMobileNav();
    initSmoothScroll();
    initPortfolioFilter();
    initProductSlider();
    initTestimonials();
    initReveal();
    initContactForm();
    initNewsletter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
document.addEventListener("DOMContentLoaded", function () {

    const counters = document.querySelectorAll(".counter");

    counters.forEach(function (counter, index) {

        const target = parseInt(counter.dataset.target, 10);
        counter.textContent = "0";
        setTimeout(function () {

            animateCounter(counter, target);

        }, 300 + (index * 150));

    });

});


function animateCounter(counter, target) {

    const duration = 1800;

    const startTime = performance.now();


    function updateCounter(currentTime) {

        const elapsed = currentTime - startTime;

        const progress = Math.min(
            elapsed / duration,
            1
        );

        const easeOutProgress =
            1 - Math.pow(1 - progress, 3);


        const currentValue = Math.floor(
            target * easeOutProgress
        );


        counter.textContent = currentValue;


        if (progress < 1) {

            requestAnimationFrame(updateCounter);

        } else {

            counter.textContent = target;

        }

    }


    requestAnimationFrame(updateCounter);

}
   //GLOBAL PAGE LOADER
(function () {

    const pageLoader = document.getElementById("pageLoader");

    if (!pageLoader) {
        return;
    }

    function showLoader() {
        pageLoader.classList.remove("is-hidden");
    }

    function hideLoader() {
        pageLoader.classList.add("is-hidden");
    }

    window.addEventListener("load", function () {
        hideLoader();
    });

    window.addEventListener("pageshow", function () {
        hideLoader();
    });

    document.addEventListener("click", function (event) {

        const link = event.target.closest("a");

        if (!link) {
            return;
        }

        const href = link.getAttribute("href");

        if (!href) {
            return;
        }
        if (
            href === "#" ||
            href.toLowerCase().startsWith("javascript:")
        ) {
            return;
        }
        if (href.startsWith("#")) {
            return;
        }
        if (link.hasAttribute("download")) {
            return;
        }
        if (link.target === "_blank") {
            return;
        }
        if (
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey ||
            event.altKey
        ) {
            return;
        }

        if (
            link.hostname &&
            link.hostname !== window.location.hostname
        ) {
            return;
        }

        showLoader();

    });

    document.addEventListener("submit", function (event) {
        const form = event.target;
        if (
            form.id === "contactForm" ||
            form.id === "newsForm" ||
              form.id === "tmChatbotForm"
        ) {
            return;
        }

        showLoader();

    });



    window.addEventListener("beforeunload", function () {
        showLoader();
    });

})();



document.addEventListener("DOMContentLoaded", function () {

    const projectsGrid =
        document.getElementById("projectsGrid");


    const filterButtons =
        document.querySelectorAll(".filter-btn");


    const projects =
        document.querySelectorAll(".project");


    const filterEmpty =
        document.getElementById("filterEmpty");


    let animationFrame;

    let isPaused = false;

    let scrollSpeed = 0.5;

    function autoScroll() {


        if (!isPaused) {

            projectsGrid.scrollLeft += scrollSpeed;

            if (
                projectsGrid.scrollLeft +
                projectsGrid.clientWidth >=
                projectsGrid.scrollWidth - 2
            ) {

                projectsGrid.scrollLeft = 0;

            }

        }


        animationFrame =
            requestAnimationFrame(autoScroll);

    }

    autoScroll();

    projectsGrid.addEventListener("mouseenter", function () {

        isPaused = true;

    });


    projectsGrid.addEventListener("mouseleave", function () {

        isPaused = false;

    });

    projectsGrid.addEventListener("touchstart", function () {

        isPaused = true;

    }, { passive: true });


    projectsGrid.addEventListener("touchend", function () {

        setTimeout(function () {

            isPaused = false;

        }, 1000);

    }, { passive: true });

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const selectedFilter =
                this.getAttribute("data-filter");
            filterButtons.forEach(function (btn) {
                btn.classList.remove("is-active");
                btn.setAttribute(
                    "aria-pressed",
                    "false"
                );
            });
            this.classList.add("is-active");
            this.setAttribute(
                "aria-pressed",
                "true"
            );
            let visibleCount = 0;
            projects.forEach(function (project) {
                const category =
                    project.getAttribute(
                        "data-category"
                    );


                if (
                    selectedFilter === "all" ||
                    category === selectedFilter
                ) {

                    project.classList.remove(
                        "is-hidden"
                    );


                    visibleCount++;

                }

                else {

                    project.classList.add(
                        "is-hidden"
                    );

                }

            });
            projectsGrid.scrollLeft = 0;
            if (visibleCount === 0) {
                filterEmpty.hidden = false;
            }

            else {
                filterEmpty.hidden = true;
            }


        });


    });


});

document.addEventListener("DOMContentLoaded", function () {
    const chatbot =
        document.getElementById("tmChatbot");

    const openButton =
        document.getElementById("tmChatbotButton");

    const closeButton =
        document.getElementById("tmChatbotClose");

    const chatWindow =
        document.getElementById("tmChatbotWindow");

    const form =
        document.getElementById("tmChatbotForm");

    const input =
        document.getElementById("tmChatbotInput");

    const messages =
        document.getElementById("tmChatbotMessages");
    function openChat() {

        chatbot.classList.add("is-open");

        openButton.setAttribute(
            "aria-expanded",
            "true"
        );

        chatWindow.setAttribute(
            "aria-hidden",
            "false"
        );

        setTimeout(function () {

            input.focus();

        }, 300);
    }
    function closeChat() {

        chatbot.classList.remove("is-open");

        openButton.setAttribute(
            "aria-expanded",
            "false"
        );

        chatWindow.setAttribute(
            "aria-hidden",
            "true"
        );
    }
    openButton.addEventListener(
        "click",
        function () {

            if (
                chatbot.classList.contains("is-open")
            ) {

                closeChat();

            } else {

                openChat();

            }

        }
    );
    closeButton.addEventListener(
        "click",
        function () {

            closeChat();

        }
    );
    document
        .querySelectorAll(
            ".tm-chatbot__quick button"
        )
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const text =
                        button.getAttribute(
                            "data-chat"
                        );

                    sendMessage(text);

                }
            );

        });

form.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();
        event.stopPropagation();

        const text = input.value.trim();

        if (!text) {
            return;
        }

        sendMessage(text);

    }
);

    function sendMessage(text) {

        addMessage(
            text,
            "user"
        );

        input.value = "";

        showTyping();


        setTimeout(function () {

            removeTyping();

            const response =
                getBotResponse(text);

            addMessage(
                response,
                "bot"
            );

        }, 800);

    }


    function getBotResponse(text) {

        const message =
            text.toLowerCase();


        if (
            message.includes("service")
        ) {

            return `
                We provide custom software development,
                web applications, enterprise solutions,
                healthcare software, API integrations,
                cloud solutions and automation.
            `;

        }


        if (
            message.includes("project")
        ) {

            return `
                We'd be happy to discuss your project.
                Tell us about your requirements and our
                team can help you choose the right solution.
            `;

        }


        if (
            message.includes("healthcare") ||
            message.includes("lims")
        ) {

            return `
                TechMitra develops healthcare-focused
                solutions including Laboratory Information
                Management Systems and hospital workflows.
            `;

        }


        if (
            message.includes("contact")
        ) {

            return `
                You can contact the TechMitra team through
                the Contact section of our website.
                We would be happy to discuss your requirements.
            `;

        }


        return `
            Thanks for contacting TechMitra! 👋
            Our team can help with software development,
            healthcare solutions, web applications,
            integrations and business automation.
        `;

    }
    function addMessage(text, type) {

        const message =
            document.createElement("div");


        message.className =
            "tm-chatbot__message " +
            "tm-chatbot__message--" +
            type;


        if (type === "bot") {

            message.innerHTML = `

                <div class="tm-chatbot__message-icon">
                    TM
                </div>

                <div class="tm-chatbot__bubble">

                    <p>${text}</p>

                </div>

            `;

        } else {

            message.innerHTML = `

                <div class="tm-chatbot__bubble">

                    <p>
                        ${escapeHtml(text)}
                    </p>

                </div>

            `;

        }


        messages.appendChild(message);

        scrollToBottom();
    }

    function showTyping() {

        const typing =
            document.createElement("div");


        typing.id =
            "tmChatbotTyping";


        typing.className =
            "tm-chatbot__message";


        typing.innerHTML = `

            <div class="tm-chatbot__message-icon">
                TM
            </div>

            <div class="tm-chatbot__bubble">

                <span style="
                    display:flex;
                    gap:4px;
                    align-items:center;
                    height:16px;
                ">

                    <i class="tm-typing-dot"></i>
                    <i class="tm-typing-dot"></i>
                    <i class="tm-typing-dot"></i>

                </span>

            </div>
        `;


        messages.appendChild(typing);

        scrollToBottom();
    }

    function removeTyping() {

        const typing =
            document.getElementById(
                "tmChatbotTyping"
            );


        if (typing) {

            typing.remove();

        }

    }

    function scrollToBottom() {

        messages.scrollTo({

            top:
                messages.scrollHeight,

            behavior:
                "smooth"

        });

    }

    function escapeHtml(text) {

        const div =
            document.createElement("div");

        div.textContent =
            text;

        return div.innerHTML;
    }
    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                chatbot.classList.contains("is-open")
            ) {

                closeChat();

            }

        }
    );

});

const tmTypingStyle =
document.createElement("style");


tmTypingStyle.textContent = `

.tm-typing-dot {

    width: 5px;
    height: 5px;

    display: block;

    border-radius: 50%;

    background: #9da6a0;

    animation:
        tmTyping 1s infinite;
}


.tm-typing-dot:nth-child(2) {

    animation-delay: .15s;
}


.tm-typing-dot:nth-child(3) {

    animation-delay: .30s;
}


@keyframes tmTyping {

    0%,
    100% {

        opacity: .35;

        transform:
            translateY(0);
    }

    50% {

        opacity: 1;

        transform:
            translateY(-3px);
    }

}

`;


document.head.appendChild(
    tmTypingStyle
);


