/* =========================================================
   TECHMITRA CAREERS SYSTEM
   HTML + CSS + JavaScript only
========================================================= */

(function () {

    "use strict";


    /* =====================================================
       SETTINGS
    ===================================================== */

    const JOB_STORAGE_KEY = "techmitra_careers_jobs";

    const ADMIN_SESSION_KEY = "techmitra_careers_admin";

    /*
       ALL APPLICATIONS WILL GO TO THIS EMAIL
    */
    const APPLICATION_EMAIL = "info@techmitra.co.in";


    /*
       ADMIN LOGIN
       Static website only.
    */

    const ADMIN_USERNAME = "admin";

    const ADMIN_PASSWORD = "TechMitra@123";


    /* =====================================================
       DEFAULT JOBS
    ===================================================== */

    const DEFAULT_JOBS = [

        {
            id: "tm-dotnet-developer-001",

            title: ".NET Developer",

            type: "Full Time",

            location: "Hyderabad / Remote",

            experience: "2 - 4 Years",

            department: "Engineering",

            salary: "Competitive",

            expiry: "2026-12-31",

            email: APPLICATION_EMAIL,

            skills: [
                "C#",
                "ASP.NET Core",
                "ASP.NET MVC",
                "SQL Server",
                "Web API",
                "JavaScript"
            ],

            shortDescription:
                "Build and maintain modern web applications and enterprise software solutions.",

            description:
                "We are looking for a .NET Developer who can contribute to application development, bug fixing, database integration and API development.",

            responsibilities:
                "Develop and maintain ASP.NET Core applications.\nWork with SQL Server and APIs.\nUnderstand business requirements and implement solutions.\nDebug and fix application issues.\nWrite clean and maintainable code.\nParticipate in testing and deployment activities.",

            requirements:
                "Strong knowledge of C#.\nExperience with ASP.NET Core or ASP.NET MVC.\nGood understanding of SQL Server.\nKnowledge of REST APIs.\nGood problem-solving skills.\nAbility to work collaboratively.",

            published: true,

            createdAt: new Date().toISOString()
        },


        {
            id: "tm-angular-developer-001",

            title: "Angular Developer",

            type: "Full Time",

            location: "Hyderabad / Remote",

            experience: "1 - 3 Years",

            department: "Engineering",

            salary: "Competitive",

            expiry: "2026-11-30",

            email: APPLICATION_EMAIL,

            skills: [
                "Angular",
                "TypeScript",
                "JavaScript",
                "HTML",
                "CSS",
                "REST API"
            ],

            shortDescription:
                "Develop responsive and modern interfaces for business and enterprise applications.",

            description:
                "We are looking for an Angular Developer to build responsive and user-friendly web interfaces integrated with backend APIs.",

            responsibilities:
                "Develop Angular components and pages.\nIntegrate REST APIs.\nBuild responsive interfaces.\nWork with designers and backend developers.\nFix UI and functional issues.\nImprove application performance.",

            requirements:
                "Good knowledge of Angular.\nStrong JavaScript or TypeScript fundamentals.\nHTML and CSS knowledge.\nExperience working with REST APIs.\nGood understanding of responsive design.",

            published: true,

            createdAt: new Date().toISOString()
        }

    ];


    /* =====================================================
       HELPERS
    ===================================================== */

    function getJobs() {

        try {

            const stored =
                localStorage.getItem(JOB_STORAGE_KEY);


            if (!stored) {

                localStorage.setItem(
                    JOB_STORAGE_KEY,
                    JSON.stringify(DEFAULT_JOBS)
                );

                return DEFAULT_JOBS;
            }


            const jobs =
                JSON.parse(stored);


            return Array.isArray(jobs)
                ? jobs
                : DEFAULT_JOBS;


        } catch (error) {

            console.error(
                "Unable to read jobs:",
                error
            );

            return DEFAULT_JOBS;
        }

    }


    function saveJobs(jobs) {

        localStorage.setItem(
            JOB_STORAGE_KEY,
            JSON.stringify(jobs)
        );

    }


    function createId() {

        return "tm-job-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2, 8);

    }


    function isExpired(job) {

        if (!job.expiry) {
            return false;
        }


        const today =
            new Date();


        today.setHours(
            0,
            0,
            0,
            0
        );


        const expiry =
            new Date(
                job.expiry + "T23:59:59"
            );


        return expiry < today;

    }


    function escapeHTML(value) {

        if (
            value === null ||
            value === undefined
        ) {

            return "";

        }


        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    function formatDate(dateString) {

        if (!dateString) {
            return "";
        }


        const date =
            new Date(
                dateString + "T00:00:00"
            );


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    }


    function getSkills(job) {

        if (Array.isArray(job.skills)) {

            return job.skills;

        }


        if (typeof job.skills === "string") {

            return job.skills
                .split(",")
                .map(function (skill) {

                    return skill.trim();

                })
                .filter(Boolean);

        }


        return [];

    }


    function getListItems(text) {

        if (!text) {

            return [];

        }


        return text
            .split("\n")
            .map(function (item) {

                return item.trim();

            })
            .filter(Boolean);

    }


    /* =====================================================
       PUBLIC CAREERS PAGE
    ===================================================== */

    const jobsContainer =
        document.getElementById(
            "jobsContainer"
        );


    if (jobsContainer) {

        initCareersPage();

    }


    function initCareersPage() {

        const search =
            document.getElementById(
                "jobSearch"
            );


        const typeFilter =
            document.getElementById(
                "jobTypeFilter"
            );


        const locationFilter =
            document.getElementById(
                "jobLocationFilter"
            );


        const careerYear =
            document.getElementById(
                "careerYear"
            );


        if (careerYear) {

            careerYear.textContent =
                new Date().getFullYear();

        }


        populateLocationFilter();


        renderPublicJobs();


        if (search) {

            search.addEventListener(
                "input",
                renderPublicJobs
            );

        }


        if (typeFilter) {

            typeFilter.addEventListener(
                "change",
                renderPublicJobs
            );

        }


        if (locationFilter) {

            locationFilter.addEventListener(
                "change",
                renderPublicJobs
            );

        }


        setupJobModal();


        /*
           Check expiry every 30 seconds.
        */

        setInterval(
            renderPublicJobs,
            30000
        );


        /*
           Open job from URL
           Example:

           careers.html?job=tm-angular-developer-001
        */

        const params =
            new URLSearchParams(
                window.location.search
            );


        const jobId =
            params.get("job");


        if (jobId) {

            setTimeout(
                function () {

                    openJobDetails(
                        jobId
                    );

                },
                100
            );

        }

    }


    /* =====================================================
       LOCATION FILTER
    ===================================================== */

    function populateLocationFilter() {

        const filter =
            document.getElementById(
                "jobLocationFilter"
            );


        if (!filter) {

            return;

        }


        const jobs =
            getJobs()
                .filter(function (job) {

                    return job.published &&
                        !isExpired(job);

                });


        const locations = [
            ...new Set(
                jobs.map(function (job) {

                    return job.location;

                })
            )
        ];


        filter.innerHTML = `
            <option value="all">
                All Locations
            </option>
        `;


        locations.forEach(
            function (location) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    location;


                option.textContent =
                    location;


                filter.appendChild(
                    option
                );

            }
        );

    }


    /* =====================================================
       RENDER PUBLIC JOBS
    ===================================================== */

    function renderPublicJobs() {

        const searchInput =
            document.getElementById(
                "jobSearch"
            );


        const typeFilter =
            document.getElementById(
                "jobTypeFilter"
            );


        const locationFilter =
            document.getElementById(
                "jobLocationFilter"
            );


        const search =
            searchInput
                ? searchInput.value
                    .toLowerCase()
                    .trim()
                : "";


        const type =
            typeFilter
                ? typeFilter.value
                : "all";


        const location =
            locationFilter
                ? locationFilter.value
                : "all";


        const jobs =
            getJobs();


        const filteredJobs =
            jobs.filter(function (job) {

                /*
                   Only published jobs.
                */

                if (!job.published) {

                    return false;

                }


                /*
                   Hide expired jobs.
                */

                if (isExpired(job)) {

                    return false;

                }


                if (
                    type !== "all" &&
                    job.type !== type
                ) {

                    return false;

                }


                if (
                    location !== "all" &&
                    job.location !== location
                ) {

                    return false;

                }


                if (!search) {

                    return true;

                }


                const searchableText = [

                    job.title,

                    job.location,

                    job.type,

                    job.department,

                    job.experience,

                    job.shortDescription,

                    job.description,

                    getSkills(job).join(" ")

                ]
                    .join(" ")
                    .toLowerCase();


                return searchableText
                    .includes(search);

            });


        jobsContainer.innerHTML = "";


        filteredJobs.forEach(
            function (job) {

                jobsContainer.insertAdjacentHTML(
                    "beforeend",
                    createJobCard(job)
                );

            }
        );


        const noJobs =
            document.getElementById(
                "noJobs"
            );


        if (noJobs) {

            noJobs.classList.toggle(
                "show",
                filteredJobs.length === 0
            );

        }


        const heroCount =
            document.getElementById(
                "heroJobCount"
            );


        if (heroCount) {

            const activeJobs =
                jobs.filter(function (job) {

                    return job.published &&
                        !isExpired(job);

                });


            heroCount.textContent =
                activeJobs.length;

        }

    }


    /* =====================================================
       CREATE JOB CARD
    ===================================================== */

    function createJobCard(job) {

        const skills =
            getSkills(job);


        const skillsHTML =
            skills
                .slice(0, 6)
                .map(function (skill) {

                    return `
                        <span>
                            ${escapeHTML(skill)}
                        </span>
                    `;

                })
                .join("");


        return `

            <article
                class="career-job-card"
                data-job-id="${escapeHTML(job.id)}"
            >

                <div class="career-job-top">

                    <span class="career-job-type">
                        ${escapeHTML(job.type)}
                    </span>

                    <span class="career-job-department">
                        ${escapeHTML(
                            job.department ||
                            "Technology"
                        )}
                    </span>

                </div>


                <h3>
                    ${escapeHTML(job.title)}
                </h3>


                <p class="career-job-short">
                    ${escapeHTML(
                        job.shortDescription
                    )}
                </p>


                <div class="career-job-meta">

                    <span>
                        📍
                        ${escapeHTML(
                            job.location
                        )}
                    </span>

                    <span>
                        ◷
                        ${escapeHTML(
                            job.experience
                        )}
                    </span>

                </div>


                <div class="career-job-skills">

                    ${skillsHTML}

                </div>


                <div class="career-job-footer">

                    <span class="career-job-expiry">

                        Apply by
                        ${formatDate(job.expiry)}

                    </span>


                    <a
                        href="careers.html?job=${encodeURIComponent(job.id)}"
                        class="career-view-btn"
                    >

                        View Position

                        <span>→</span>

                    </a>

                </div>

            </article>

        `;

    }


    /* =====================================================
       JOB MODAL SETUP
    ===================================================== */

    function setupJobModal() {

        const modal =
            document.getElementById(
                "jobModal"
            );


        const close =
            document.getElementById(
                "jobModalClose"
            );


        const overlay =
            document.getElementById(
                "jobModalOverlay"
            );


        if (!modal) {

            return;

        }


        if (close) {

            close.addEventListener(
                "click",
                closeJobModal
            );

        }


        if (overlay) {

            overlay.addEventListener(
                "click",
                closeJobModal
            );

        }


        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Escape"
                ) {

                    closeJobModal();

                }

            }
        );


        /*
           View Position click
        */

        document.addEventListener(
            "click",
            function (event) {

                const link =
                    event.target.closest(
                        ".career-view-btn"
                    );


                if (!link) {

                    return;

                }


                const href =
                    link.getAttribute(
                        "href"
                    );


                if (!href) {

                    return;

                }


                event.preventDefault();


                const url =
                    new URL(
                        href,
                        window.location.href
                    );


                const jobId =
                    url.searchParams.get(
                        "job"
                    );


                if (jobId) {

                    openJobDetails(
                        jobId
                    );


                    history.pushState(
                        {},
                        "",
                        "careers.html?job=" +
                        encodeURIComponent(
                            jobId
                        )
                    );

                }

            }
        );

    }


    /* =====================================================
       OPEN JOB DETAILS
    ===================================================== */

    function openJobDetails(jobId) {

        const jobs =
            getJobs();


        const job =
            jobs.find(function (item) {

                return item.id === jobId;

            });


        if (!job) {

            console.warn(
                "Job not found:",
                jobId
            );

            return;

        }


        /*
           Do not show unpublished or expired jobs.
        */

        if (
            !job.published ||
            isExpired(job)
        ) {

            return;

        }


        const modal =
            document.getElementById(
                "jobModal"
            );


        const details =
            document.getElementById(
                "jobDetails"
            );


        if (!modal || !details) {

            return;

        }


        const skills =
            getSkills(job);


        const skillsHTML =
            skills
                .map(function (skill) {

                    return `
                        <span>
                            ${escapeHTML(skill)}
                        </span>
                    `;

                })
                .join("");


        const responsibilities =
            getListItems(
                job.responsibilities
            );


        const requirements =
            getListItems(
                job.requirements
            );


        const responsibilitiesHTML =
            responsibilities
                .map(function (item) {

                    return `
                        <li>
                            ${escapeHTML(item)}
                        </li>
                    `;

                })
                .join("");


        const requirementsHTML =
            requirements
                .map(function (item) {

                    return `
                        <li>
                            ${escapeHTML(item)}
                        </li>
                    `;

                })
                .join("");


        /* =================================================
           APPLICATION EMAIL
        =================================================

           Recipient:
           info@techmitra.co.in

           Job role:
           job.title

           This is dynamic.
        */

        const email =
            APPLICATION_EMAIL;


        /*
           Dynamic subject.

           Example:

           Application for Angular Developer

           Application for .NET Developer
        */

        const subject =
            encodeURIComponent(
                "Application for " +
                job.title
            );


        /*
           Dynamic email body.
        */

        const body =
            encodeURIComponent(
`Hello TechMitra Team,

I would like to apply for the ${job.title} position.

Job Position: ${job.title}
Location: ${job.location}
Experience: ${job.experience}

Name:
Phone:
Email:
Experience:

Please find my resume attached.

Regards,
`
            );


        /*
           Gmail Compose URL

           This opens Gmail directly instead
           of depending on the computer's
           mailto/default-email setting.
        */

        const gmailComposeUrl =
            "https://mail.google.com/mail/?view=cm&fs=1" +
            "&to=" +
            encodeURIComponent(email) +
            "&su=" +
            subject +
            "&body=" +
            body;


        /* =================================================
           JOB DETAILS HTML
        ================================================= */

        details.innerHTML = `

            <div class="job-details-header">

                <span class="career-eyebrow">

                    <span></span>

                    ${escapeHTML(job.type)}

                </span>


                <h2>
                    ${escapeHTML(job.title)}
                </h2>


                <div class="job-details-meta">

                    <span>
                        📍
                        ${escapeHTML(
                            job.location
                        )}
                    </span>


                    <span>
                        ◷
                        ${escapeHTML(
                            job.experience
                        )}
                    </span>


                    <span>
                        Department:
                        ${escapeHTML(
                            job.department ||
                            "Technology"
                        )}
                    </span>


                    <span>
                        Salary:
                        ${escapeHTML(
                            job.salary ||
                            "Competitive"
                        )}
                    </span>

                </div>

            </div>


            <div class="job-details-section">

                <h3>
                    About the Role
                </h3>

                <p>
                    ${escapeHTML(
                        job.description
                    )}
                </p>

            </div>


            ${
                responsibilities.length
                ? `

                    <div class="job-details-section">

                        <h3>
                            Responsibilities
                        </h3>

                        <ul>

                            ${responsibilitiesHTML}

                        </ul>

                    </div>

                `
                : ""
            }


            ${
                requirements.length
                ? `

                    <div class="job-details-section">

                        <h3>
                            Requirements
                        </h3>

                        <ul>

                            ${requirementsHTML}

                        </ul>

                    </div>

                `
                : ""
            }


            ${
                skills.length
                ? `

                    <div class="job-details-section">

                        <h3>
                            Skills
                        </h3>

                        <div class="job-details-skills">

                            ${skillsHTML}

                        </div>

                    </div>

                `
                : ""
            }


            <div class="job-apply-area">

                <p>

                    Application deadline:

                    <strong>
                        ${formatDate(
                            job.expiry
                        )}
                    </strong>

                </p>


                <!--
                    APPLY BUTTON

                    Gmail opens directly.

                    Recipient:
                    info@techmitra.co.in

                    Role:
                    dynamically from job.title
                -->

                <a
                    class="career-primary-btn"
                    href="${gmailComposeUrl}"
                    target="_blank"
                    rel="noopener noreferrer"
                >

                    Apply for this Position

                    <span>→</span>

                </a>

            </div>

        `;


        modal.classList.add(
            "open"
        );


        modal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.style.overflow =
            "hidden";

    }


    /* =====================================================
       CLOSE JOB MODAL
    ===================================================== */

    function closeJobModal() {

        const modal =
            document.getElementById(
                "jobModal"
            );


        if (!modal) {

            return;

        }


        modal.classList.remove(
            "open"
        );


        modal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.style.overflow =
            "";


        /*
           Remove ?job= from URL
        */

        if (
            window.location.search
        ) {

            history.pushState(
                {},
                "",
                "careers.html"
            );

        }

    }


    /* =====================================================
       ADMIN PAGE
    ===================================================== */

    const adminLogin =
        document.getElementById(
            "adminLogin"
        );


    if (adminLogin) {

        initAdminPage();

    }


    function initAdminPage() {

        const loggedIn =
            sessionStorage.getItem(
                ADMIN_SESSION_KEY
            );


        if (loggedIn === "true") {

            showAdminDashboard();

        } else {

            showAdminLogin();

        }


        const loginForm =
            document.getElementById(
                "adminLoginForm"
            );


        if (loginForm) {

            loginForm.addEventListener(
                "submit",
                handleAdminLogin
            );

        }


        const logout =
            document.getElementById(
                "adminLogout"
            );


        if (logout) {

            logout.addEventListener(
                "click",
                function () {

                    sessionStorage.removeItem(
                        ADMIN_SESSION_KEY
                    );


                    location.reload();

                }
            );

        }


        setupAdminJobForm();

    }


    /* =====================================================
       ADMIN LOGIN
    ===================================================== */

    function handleAdminLogin(event) {

        event.preventDefault();


        const username =
            document.getElementById(
                "adminUsername"
            ).value.trim();


        const password =
            document.getElementById(
                "adminPassword"
            ).value;


        const error =
            document.getElementById(
                "adminLoginError"
            );


        if (
            username === ADMIN_USERNAME &&
            password === ADMIN_PASSWORD
        ) {

            sessionStorage.setItem(
                ADMIN_SESSION_KEY,
                "true"
            );


            showAdminDashboard();


            document.getElementById(
                "adminPassword"
            ).value = "";


        } else {

            if (error) {

                error.textContent =
                    "Invalid username or password.";

                error.classList.add(
                    "show"
                );

            }

        }

    }


    function showAdminLogin() {

        const login =
            document.getElementById(
                "adminLogin"
            );


        const dashboard =
            document.getElementById(
                "adminDashboard"
            );


        if (login) {

            login.style.display =
                "grid";

        }


        if (dashboard) {

            dashboard.style.display =
                "none";

        }

    }


    function showAdminDashboard() {

        const login =
            document.getElementById(
                "adminLogin"
            );


        const dashboard =
            document.getElementById(
                "adminDashboard"
            );


        if (login) {

            login.style.display =
                "none";

        }


        if (dashboard) {

            dashboard.style.display =
                "block";

        }


        renderAdminTable();

    }


    /* =====================================================
       ADMIN TABLE
    ===================================================== */

    function renderAdminTable() {

        const tbody =
            document.getElementById(
                "adminJobsTable"
            );


        if (!tbody) {

            return;

        }


        const jobs =
            getJobs();


        tbody.innerHTML = "";


        jobs.forEach(
            function (job) {

                let statusClass =
                    "draft";


                let statusText =
                    "Draft";


                if (isExpired(job)) {

                    statusClass =
                        "expired";


                    statusText =
                        "Expired";


                } else if (job.published) {

                    statusClass =
                        "published";


                    statusText =
                        "Published";

                }


                tbody.insertAdjacentHTML(
                    "beforeend",
                    `

                    <tr>

                        <td>

                            <strong>
                                ${escapeHTML(
                                    job.title
                                )}
                            </strong>

                            ${escapeHTML(
                                job.department ||
                                "Technology"
                            )}

                        </td>


                        <td>
                            ${escapeHTML(
                                job.type
                            )}
                        </td>


                        <td>
                            ${escapeHTML(
                                job.location
                            )}
                        </td>


                        <td>
                            ${formatDate(
                                job.expiry
                            )}
                        </td>


                        <td>

                            <span class="
                                admin-status
                                ${statusClass}
                            ">

                                ${statusText}

                            </span>

                        </td>


                        <td>

                            <div class="admin-actions">

                                <button
                                    class="admin-action"
                                    data-edit-job="${escapeHTML(
                                        job.id
                                    )}"
                                >
                                    Edit
                                </button>


                                <button
                                    class="admin-action"
                                    data-toggle-job="${escapeHTML(
                                        job.id
                                    )}"
                                >
                                    ${
                                        job.published
                                        ? "Unpublish"
                                        : "Publish"
                                    }
                                </button>


                                <button
                                    class="
                                        admin-action
                                        delete
                                    "
                                    data-delete-job="${escapeHTML(
                                        job.id
                                    )}"
                                >
                                    Delete
                                </button>

                            </div>

                        </td>

                    </tr>

                    `
                );

            }
        );


        updateAdminStats();


        /* EDIT */

        tbody
            .querySelectorAll(
                "[data-edit-job]"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            openEditJob(
                                button.dataset.editJob
                            );

                        }
                    );

                }
            );


        /* PUBLISH */

        tbody
            .querySelectorAll(
                "[data-toggle-job]"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            toggleJob(
                                button.dataset.toggleJob
                            );

                        }
                    );

                }
            );


        /* DELETE */

        tbody
            .querySelectorAll(
                "[data-delete-job]"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            deleteJob(
                                button.dataset.deleteJob
                            );

                        }
                    );

                }
            );

    }


    /* =====================================================
       ADMIN STATS
    ===================================================== */

    function updateAdminStats() {

        const jobs =
            getJobs();


        const published =
            jobs.filter(
                function (job) {

                    return job.published &&
                        !isExpired(job);

                }
            );


        const expired =
            jobs.filter(
                function (job) {

                    return isExpired(job);

                }
            );


        const drafts =
            jobs.filter(
                function (job) {

                    return !job.published &&
                        !isExpired(job);

                }
            );


        const totalJobs =
            document.getElementById(
                "totalJobs"
            );


        const publishedJobs =
            document.getElementById(
                "publishedJobs"
            );


        const expiredJobs =
            document.getElementById(
                "expiredJobs"
            );


        const draftJobs =
            document.getElementById(
                "draftJobs"
            );


        if (totalJobs) {

            totalJobs.textContent =
                jobs.length;

        }


        if (publishedJobs) {

            publishedJobs.textContent =
                published.length;

        }


        if (expiredJobs) {

            expiredJobs.textContent =
                expired.length;

        }


        if (draftJobs) {

            draftJobs.textContent =
                drafts.length;

        }

    }


    /* =====================================================
       ADMIN JOB FORM
    ===================================================== */

    function setupAdminJobForm() {

        const newButton =
            document.getElementById(
                "newJobButton"
            );


        const form =
            document.getElementById(
                "jobForm"
            );


        const close =
            document.getElementById(
                "jobFormClose"
            );


        const cancel =
            document.getElementById(
                "cancelJobForm"
            );


        const overlay =
            document.getElementById(
                "jobFormOverlay"
            );


        if (newButton) {

            newButton.addEventListener(
                "click",
                openNewJobForm
            );

        }


        if (close) {

            close.addEventListener(
                "click",
                closeJobForm
            );

        }


        if (cancel) {

            cancel.addEventListener(
                "click",
                closeJobForm
            );

        }


        if (overlay) {

            overlay.addEventListener(
                "click",
                closeJobForm
            );

        }


        if (form) {

            form.addEventListener(
                "submit",
                saveJob
            );

        }

    }


    /* =====================================================
       NEW JOB
    ===================================================== */

    function openNewJobForm() {

        const modal =
            document.getElementById(
                "jobFormModal"
            );


        const form =
            document.getElementById(
                "jobForm"
            );


        if (form) {

            form.reset();

        }


        document.getElementById(
            "editJobId"
        ).value = "";


        document.getElementById(
            "jobFormTitle"
        ).textContent =
            "Add New Position";


        document.getElementById(
            "jobPublished"
        ).checked =
            true;


        /*
           Application email is fixed.
        */

        const jobEmail =
            document.getElementById(
                "jobEmail"
            );


        if (jobEmail) {

            jobEmail.value =
                APPLICATION_EMAIL;

        }


        if (modal) {

            modal.classList.add(
                "open"
            );

        }


        document.body.style.overflow =
            "hidden";

    }


    /* =====================================================
       EDIT JOB
    ===================================================== */

    function openEditJob(jobId) {

        const jobs =
            getJobs();


        const job =
            jobs.find(
                function (item) {

                    return item.id === jobId;

                }
            );


        if (!job) {

            return;

        }


        document.getElementById(
            "editJobId"
        ).value =
            job.id;


        document.getElementById(
            "jobTitle"
        ).value =
            job.title || "";


        document.getElementById(
            "jobType"
        ).value =
            job.type || "Full Time";


        document.getElementById(
            "jobLocation"
        ).value =
            job.location || "";


        document.getElementById(
            "jobExperience"
        ).value =
            job.experience || "";


        document.getElementById(
            "jobDepartment"
        ).value =
            job.department || "";


        document.getElementById(
            "jobSalary"
        ).value =
            job.salary || "";


        document.getElementById(
            "jobExpiry"
        ).value =
            job.expiry || "";


        /*
           Always use TechMitra application email.
        */

        const jobEmail =
            document.getElementById(
                "jobEmail"
            );


        if (jobEmail) {

            jobEmail.value =
                APPLICATION_EMAIL;

        }


        document.getElementById(
            "jobSkills"
        ).value =
            getSkills(job)
                .join(", ");


        document.getElementById(
            "jobShortDescription"
        ).value =
            job.shortDescription || "";


        document.getElementById(
            "jobDescription"
        ).value =
            job.description || "";


        document.getElementById(
            "jobResponsibilities"
        ).value =
            job.responsibilities || "";


        document.getElementById(
            "jobRequirements"
        ).value =
            job.requirements || "";


        document.getElementById(
            "jobPublished"
        ).checked =
            !!job.published;


        document.getElementById(
            "jobFormTitle"
        ).textContent =
            "Edit Position";


        document.getElementById(
            "jobFormModal"
        ).classList.add(
            "open"
        );


        document.body.style.overflow =
            "hidden";

    }


    /* =====================================================
       SAVE JOB
    ===================================================== */

    function saveJob(event) {

        event.preventDefault();


        const id =
            document.getElementById(
                "editJobId"
            ).value;


        const jobs =
            getJobs();


        const jobData = {

            id:
                id ||
                createId(),


            title:
                document.getElementById(
                    "jobTitle"
                ).value.trim(),


            type:
                document.getElementById(
                    "jobType"
                ).value,


            location:
                document.getElementById(
                    "jobLocation"
                ).value.trim(),


            experience:
                document.getElementById(
                    "jobExperience"
                ).value.trim(),


            department:
                document.getElementById(
                    "jobDepartment"
                ).value.trim(),


            salary:
                document.getElementById(
                    "jobSalary"
                ).value.trim(),


            expiry:
                document.getElementById(
                    "jobExpiry"
                ).value,


            /*
               ALWAYS SEND APPLICATIONS TO:
               info@techmitra.co.in
            */

            email:
                APPLICATION_EMAIL,


            skills:
                document.getElementById(
                    "jobSkills"
                ).value
                    .split(",")
                    .map(
                        function (skill) {

                            return skill.trim();

                        }
                    )
                    .filter(Boolean),


            shortDescription:
                document.getElementById(
                    "jobShortDescription"
                ).value.trim(),


            description:
                document.getElementById(
                    "jobDescription"
                ).value.trim(),


            responsibilities:
                document.getElementById(
                    "jobResponsibilities"
                ).value.trim(),


            requirements:
                document.getElementById(
                    "jobRequirements"
                ).value.trim(),


            published:
                document.getElementById(
                    "jobPublished"
                ).checked,


            createdAt:
                new Date().toISOString()

        };


        if (id) {

            const index =
                jobs.findIndex(
                    function (job) {

                        return job.id === id;

                    }
                );


            if (index !== -1) {

                /*
                   Preserve original created date.
                */

                jobData.createdAt =
                    jobs[index].createdAt ||
                    jobData.createdAt;


                jobs[index] =
                    jobData;

            }

        } else {

            jobs.unshift(
                jobData
            );

        }


        saveJobs(jobs);


        closeJobForm();


        renderAdminTable();


        alert(
            id
                ? "Job position updated successfully."
                : "Job position added successfully."
        );

    }


    /* =====================================================
       CLOSE ADMIN FORM
    ===================================================== */

    function closeJobForm() {

        const modal =
            document.getElementById(
                "jobFormModal"
            );


        if (!modal) {

            return;

        }


        modal.classList.remove(
            "open"
        );


        document.body.style.overflow =
            "";

    }


    /* =====================================================
       PUBLISH / UNPUBLISH
    ===================================================== */

    function toggleJob(jobId) {

        const jobs =
            getJobs();


        const job =
            jobs.find(
                function (item) {

                    return item.id === jobId;

                }
            );


        if (!job) {

            return;

        }


        if (isExpired(job)) {

            alert(
                "This job has expired. Please update the expiry date before publishing it."
            );


            return;

        }


        job.published =
            !job.published;


        saveJobs(jobs);


        renderAdminTable();

    }


    function deleteJob(jobId) {

        const jobs =
            getJobs();


        const job =
            jobs.find(
                function (item) {

                    return item.id === jobId;

                }
            );


        if (!job) {

            return;

        }


        const confirmed =
            confirm(
                'Delete "' +
                job.title +
                '"?'
            );


        if (!confirmed) {

            return;

        }


        const updated =
            jobs.filter(
                function (item) {

                    return item.id !== jobId;

                }
            );


        saveJobs(updated);


        renderAdminTable();

    }


})();