(function () {
    var nav = document.querySelector(".nav");
    var toggle = document.querySelector(".nav-toggle");
    var panel = document.getElementById("site-nav");
    var page = document.getElementById("page");
    if (!nav || !toggle || !panel) return;

    var label = toggle.querySelector("[data-label]");
    var mq = window.matchMedia("(max-width: 880px)");
    var scrollY = 0;
    var locked = false;

    function mobile() {
        return mq.matches;
    }

    function lockScroll(on) {
        if (on && !locked) {
            scrollY = window.scrollY || window.pageYOffset || 0;
            document.body.classList.add("nav-open");
            document.body.style.position = "fixed";
            document.body.style.top = "-" + scrollY + "px";
            document.body.style.left = "0";
            document.body.style.right = "0";
            document.body.style.width = "100%";
            locked = true;
            return;
        }
        if (!on && locked) {
            document.body.classList.remove("nav-open");
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.left = "";
            document.body.style.right = "";
            document.body.style.width = "";
            locked = false;
            var root = document.documentElement;
            var previous = root.style.scrollBehavior;
            root.style.scrollBehavior = "auto";
            window.scrollTo(0, scrollY);
            root.style.scrollBehavior = previous;
        }
    }

    function setOpen(open) {
        var isOpen = Boolean(open) && mobile();
        if (isOpen) lockScroll(true);
        nav.classList.toggle("is-open", isOpen);
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        toggle.setAttribute("aria-label", isOpen ? "Zavřít menu" : "Otevřít menu");
        if (label) label.textContent = isOpen ? "Zavřít" : "Menu";
        panel.inert = mobile() && !isOpen;
        panel.setAttribute("aria-hidden", mobile() && !isOpen ? "true" : "false");
        if (page) page.inert = isOpen;

        if (isOpen) {
            nav.setAttribute("role", "dialog");
            nav.setAttribute("aria-modal", "true");
            nav.setAttribute("aria-label", "Hlavní menu");
        } else {
            nav.removeAttribute("role");
            nav.removeAttribute("aria-modal");
            nav.removeAttribute("aria-label");
            lockScroll(false);
        }
    }

    function focusable() {
        return [toggle].concat(Array.prototype.slice.call(panel.querySelectorAll("a")));
    }

    toggle.addEventListener("click", function () {
        var next = !nav.classList.contains("is-open");
        setOpen(next);
        if (next) {
            var first = panel.querySelector("a");
            if (first) first.focus({ preventScroll: true });
        }
    });

    panel.addEventListener("click", function (event) {
        var link = event.target.closest("a");
        if (!link || !nav.classList.contains("is-open")) return;
        var href = link.getAttribute("href") || "";
        var target = href.charAt(0) === "#" ? document.getElementById(href.slice(1)) : null;
        setOpen(false);
        if (target) {
            if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
            target.focus({ preventScroll: true });
        } else {
            toggle.focus({ preventScroll: true });
        }
    });

    document.addEventListener("keydown", function (event) {
        if (!nav.classList.contains("is-open")) return;
        if (event.key === "Escape") {
            event.preventDefault();
            setOpen(false);
            toggle.focus({ preventScroll: true });
            return;
        }
        if (event.key !== "Tab") return;
        var items = focusable();
        var first = items[0];
        var last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus({ preventScroll: true });
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus({ preventScroll: true });
        }
    });

    function onViewportChange() {
        if (!mobile() && nav.classList.contains("is-open")) setOpen(false);
        else if (!nav.classList.contains("is-open")) setOpen(false);
    }

    if (typeof mq.addEventListener === "function") {
        mq.addEventListener("change", onViewportChange);
    } else if (typeof mq.addListener === "function") {
        mq.addListener(onViewportChange);
    }

    setOpen(false);
})();
