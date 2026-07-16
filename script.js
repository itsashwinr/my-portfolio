/* ==========================================
   PORTFOLIO — SINGLE ENTRY POINT
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ==========================
       LOADER
    ========================== */

    const loader = document.getElementById("loader");

    window.addEventListener("load", () => {
        setTimeout(() => {
            loader.style.opacity = "0";
            loader.style.visibility = "hidden";
        }, reduceMotion ? 200 : 1800);
    });

    /* ==========================
       TYPING EFFECT
    ========================== */

    const typing = document.getElementById("typing");
    const words = ["Data Analyst", "Business Analyst", "MIS Analyst", "Data Storyteller", "Python Enthusiast"];
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeEffect() {
        const currentWord = words[wordIndex];

        if (!deleting) {
            typing.textContent = currentWord.substring(0, charIndex++);
            if (charIndex > currentWord.length) {
                deleting = true;
                setTimeout(typeEffect, 1500);
                return;
            }
        } else {
            typing.textContent = currentWord.substring(0, charIndex--);
            if (charIndex < 0) {
                deleting = false;
                wordIndex = (wordIndex + 1) % words.length;
            }
        }

        setTimeout(typeEffect, deleting ? 50 : 100);
    }

    if (typing) {
        if (reduceMotion) {
            typing.textContent = words[0];
        } else {
            typeEffect();
        }
    }

    /* ==========================
       SCROLL PROGRESS BAR (top of page)
    ========================== */

    const progressBar = document.getElementById("progress-bar");

    window.addEventListener("scroll", () => {
        const scrollTop = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = height > 0 ? (scrollTop / height) * 100 : 0;
        progressBar.style.width = progress + "%";
    });

    /* ==========================
       COUNTER ANIMATION
    ========================== */

    const counters = document.querySelectorAll(".counter");

    const counterObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const counter = entry.target;
            const target = +counter.dataset.target;

            if (reduceMotion) {
                counter.innerText = target;
                counterObserver.unobserve(counter);
                return;
            }

            let count = 0;
            const speed = target / 80;

            const update = () => {
                count += speed;
                if (count < target) {
                    counter.innerText = Math.ceil(count);
                    requestAnimationFrame(update);
                } else {
                    counter.innerText = target;
                }
            };

            update();
            counterObserver.unobserve(counter);
        });
    }, { threshold: 0.4 });

    counters.forEach(counter => counterObserver.observe(counter));

    /* ==========================
       SKILL PROGRESS BARS (animate on scroll into view)
    ========================== */

    const progressBars = document.querySelectorAll(".progress-bar");

    const progressObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const bar = entry.target;
            const width = bar.dataset.width || 0;
            bar.style.width = width + "%";
            progressObserver.unobserve(bar);
        });
    }, { threshold: 0.4 });

    progressBars.forEach(bar => progressObserver.observe(bar));

    /* ==========================
       CURSOR GLOW
    ========================== */

    const glow = document.querySelector(".cursor-glow");

    if (glow && !reduceMotion && matchMedia("(hover: hover)").matches) {
        document.addEventListener("mousemove", e => {
            glow.style.left = e.clientX + "px";
            glow.style.top = e.clientY + "px";
        });
    } else if (glow) {
        glow.style.display = "none";
    }

    /* ==========================
       SCROLL REVEAL
    ========================== */

    const reveals = document.querySelectorAll(
        "section,.skill-card,.project-card,.certificate,.timeline-item,.contact-card,.stat-card"
    );

    if (reduceMotion) {
        reveals.forEach(item => item.classList.add("reveal", "active"));
    } else {
        const revealObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add("active");
            });
        }, { threshold: 0.15 });

        reveals.forEach(item => {
            item.classList.add("reveal");
            revealObserver.observe(item);
        });
    }

    /* ==========================
       BACK TO TOP
    ========================== */

    const backToTop = document.getElementById("backToTop");

    window.addEventListener("scroll", () => {
        backToTop.classList.toggle("show", window.scrollY > 500);
    });

    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    });

    /* ==========================
       DARK/LIGHT MODE
    ========================== */

    const themeBtn = document.getElementById("theme-toggle");
    const body = document.body;
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
        body.classList.add("light-mode");
        themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    themeBtn.addEventListener("click", () => {
        body.classList.toggle("light-mode");
        const isLight = body.classList.contains("light-mode");
        localStorage.setItem("theme", isLight ? "light" : "dark");
        themeBtn.innerHTML = isLight
            ? '<i class="fa-solid fa-sun"></i>'
            : '<i class="fa-solid fa-moon"></i>';
    });

    /* ==========================
       PROJECT FILTER (category-based, not text-matching)
    ========================== */

    const filterButtons = document.querySelectorAll(".filter-buttons button");
    const projects = document.querySelectorAll(".project-card");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const filter = button.dataset.filter;

            projects.forEach(project => {
                const categories = (project.dataset.category || "").split(" ");
                const match = filter === "all" || categories.includes(filter);
                project.style.display = match ? "block" : "none";
            });
        });
    });

    /* ==========================
       SQL TERMINAL (auto-plays, but user can also step through manually)
    ========================== */

    const terminal = document.getElementById("terminal-text");
    const commands = [
        `SELECT *\nFROM Projects;\n\n4 rows returned.\n`,
        `SELECT skill\nFROM Skills\nWHERE level='Advanced';\n\nSQL\nPython\nExcel\n`,
        `SELECT *\nFROM Certifications;\n\nScaler Academy\nSQL\nPython\nTableau\n`,
        `SELECT COUNT(*)\nFROM Portfolio;\n\nPortfolio Loaded Successfully.\n`
    ];

    const dotsContainer = document.getElementById("terminal-dots");
    const prevBtn = document.getElementById("terminal-prev");
    const nextBtn = document.getElementById("terminal-next");
    const terminalWindow = document.querySelector(".terminal-window");

    let cmd = 0;
    let letter = 0;
    let typingHandle = null;
    let autoHandle = null;
    let paused = false;

    commands.forEach((_, i) => {
        const dot = document.createElement("span");
        dot.className = "terminal-dot" + (i === 0 ? " active" : "");
        dot.addEventListener("click", () => goToCommand(i));
        dotsContainer.appendChild(dot);
    });

    function setActiveDot(index) {
        [...dotsContainer.children].forEach((d, i) => d.classList.toggle("active", i === index));
    }

    function typeCommand() {
        clearTimeout(typingHandle);
        terminal.textContent = "";
        letter = 0;
        const current = commands[cmd];
        setActiveDot(cmd);

        if (reduceMotion) {
            terminal.textContent = current;
            queueAutoAdvance();
            return;
        }

        function type() {
            if (letter < current.length) {
                terminal.textContent += current.charAt(letter);
                letter++;
                typingHandle = setTimeout(type, 25);
            } else {
                queueAutoAdvance();
            }
        }

        type();
    }

    function queueAutoAdvance() {
        clearTimeout(autoHandle);
        if (paused) return;
        autoHandle = setTimeout(() => {
            cmd = (cmd + 1) % commands.length;
            typeCommand();
        }, 2500);
    }

    function goToCommand(index) {
        clearTimeout(typingHandle);
        clearTimeout(autoHandle);
        cmd = index;
        typeCommand();
    }

    if (terminal) {
        typeCommand();

        prevBtn.addEventListener("click", () => {
            goToCommand((cmd - 1 + commands.length) % commands.length);
        });

        nextBtn.addEventListener("click", () => {
            goToCommand((cmd + 1) % commands.length);
        });

        terminalWindow.addEventListener("mouseenter", () => { paused = true; clearTimeout(autoHandle); });
        terminalWindow.addEventListener("mouseleave", () => { paused = false; queueAutoAdvance(); });
    }

    /* ==========================
       NAV ACTIVE LINK
    ========================== */

    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-links a");

    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach(section => {
            const top = section.offsetTop - 150;
            if (window.scrollY >= top) current = section.getAttribute("id");
        });

        navLinks.forEach(link => {
            link.classList.toggle("active", link.getAttribute("href") === "#" + current);
        });
    });

    /* ==========================
       COPY EMAIL BUTTON
    ========================== */

    const copyBtn = document.getElementById("emailCopyBtn");

    if (copyBtn) {
        const tooltip = copyBtn.querySelector(".contact-tooltip");
        const originalTooltipText = tooltip ? tooltip.textContent : "Copy Email";

        copyBtn.addEventListener("click", async () => {
            const email = copyBtn.dataset.copy;
            try {
                await navigator.clipboard.writeText(email);
                copyBtn.classList.add("copied");
                if (tooltip) tooltip.textContent = "Copied!";
                setTimeout(() => {
                    copyBtn.classList.remove("copied");
                    if (tooltip) tooltip.textContent = originalTooltipText;
                }, 1800);
            } catch (err) {
                console.error("Clipboard copy failed:", err);
            }
        });
    }

    /* ==========================
       MAGNETIC BUTTONS (pointer devices only)
    ========================== */

    if (!reduceMotion && matchMedia("(hover: hover)").matches) {
        document.querySelectorAll(".primary-btn,.secondary-btn,.hire-btn").forEach(button => {
            button.addEventListener("mousemove", e => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                button.style.transform = `translate(${x * 0.12}px,${y * 0.12}px)`;
            });
            button.addEventListener("mouseleave", () => {
                button.style.transform = "translate(0,0)";
            });
        });
    }

    /* ==========================
       PROFILE TILT
    ========================== */

    const profile = document.querySelector(".profile-wrapper");

    if (profile && !reduceMotion && matchMedia("(hover: hover)").matches) {
        profile.addEventListener("mousemove", e => {
            const rect = profile.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateY = (x - rect.width / 2) / 18;
            const rotateX = (rect.height / 2 - y) / 18;
            profile.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        profile.addEventListener("mouseleave", () => {
            profile.style.transform = "rotateX(0) rotateY(0)";
        });
    }

    /* ==========================
       PROJECT CARD TILT
    ========================== */

    if (!reduceMotion && matchMedia("(hover: hover)").matches) {
        document.querySelectorAll(".project-card").forEach(card => {
            card.addEventListener("mousemove", e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const rotateY = (x - rect.width / 2) / 28;
                const rotateX = (rect.height / 2 - y) / 28;
                card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-12px)`;
            });

            card.addEventListener("mouseleave", () => {
                card.style.transform = "perspective(900px) rotateX(0) rotateY(0)";
            });
        });
    }

    /* ==========================
       NAVBAR HIDE ON SCROLL
    ========================== */

    const navbar = document.querySelector("header");
    let lastScroll = 0;

    window.addEventListener("scroll", () => {
        const current = window.pageYOffset;
        navbar.style.transform = (current > lastScroll && current > 120) ? "translateY(-100%)" : "translateY(0)";
        lastScroll = current;
    });

    /* ==========================
       RIPPLE EFFECT
    ========================== */

    if (!reduceMotion) {
        document.querySelectorAll("button,a").forEach(element => {
            element.addEventListener("click", function (e) {
                const circle = document.createElement("span");
                const diameter = Math.max(this.clientWidth, this.clientHeight);
                circle.style.width = diameter + "px";
                circle.style.height = diameter + "px";
                circle.style.position = "absolute";
                circle.style.borderRadius = "50%";
                circle.style.background = "rgba(255,255,255,.3)";
                circle.style.left = e.offsetX - diameter / 2 + "px";
                circle.style.top = e.offsetY - diameter / 2 + "px";
                circle.style.transform = "scale(0)";
                circle.style.animation = "ripple .6s linear";
                circle.style.pointerEvents = "none";
                this.style.position = "relative";
                this.style.overflow = "hidden";
                this.appendChild(circle);
                setTimeout(() => circle.remove(), 600);
            });
        });
    }

    /* ==========================
       SMOOTH HOVER GLOW ON CARDS
    ========================== */

    if (!reduceMotion && matchMedia("(hover: hover)").matches) {
        document.querySelectorAll(".skill-card,.certificate,.contact-card").forEach(card => {
            card.addEventListener("mousemove", e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(59,130,246,.18), rgba(255,255,255,.05))`;
            });

            card.addEventListener("mouseleave", () => {
                card.style.background = "rgba(255,255,255,.05)";
            });
        });
    }

    console.log("%cPortfolio Loaded Successfully", "color:#3b82f6;font-size:18px;font-weight:bold");
});
