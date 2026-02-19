document.addEventListener("DOMContentLoaded", function () {
    const themeToggle = document.getElementById("themeToggle");
    const themeToggleLabel = document.getElementById("themeToggleLabel");
    const themeToggleThumb = document.getElementById("themeToggleThumb");

    function applyTheme(mode) {
        const isLight = mode === "light";
        if (isLight) {
            document.body.classList.add("light");
            if (themeToggleLabel) {
                themeToggleLabel.textContent = "Mode terang";
            }
            if (themeToggleThumb) {
                themeToggleThumb.classList.remove("translate-x-1");
                themeToggleThumb.classList.add("translate-x-4");
            }
        } else {
            document.body.classList.remove("light");
            if (themeToggleLabel) {
                themeToggleLabel.textContent = "Mode gelap";
            }
            if (themeToggleThumb) {
                themeToggleThumb.classList.remove("translate-x-4");
                themeToggleThumb.classList.add("translate-x-1");
            }
        }
    }

    const savedTheme = localStorage.getItem("dashboard-theme") || "dark";
    applyTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            const isLight = document.body.classList.contains("light");
            const nextTheme = isLight ? "dark" : "light";
            applyTheme(nextTheme);
            localStorage.setItem("dashboard-theme", nextTheme);
        });
    }

    const menuToggle = document.getElementById("menuToggle");
    const mobileMenu = document.getElementById("mobileMenu");
    const sidebar = document.getElementById("sidebar");
    const mainContent = document.getElementById("mainContent");

    if (menuToggle && (mobileMenu || sidebar || mainContent)) {
        menuToggle.addEventListener("click", function () {
            if (mobileMenu) {
                const isHidden = mobileMenu.style.display === "none" || mobileMenu.style.display === "";
                mobileMenu.style.display = isHidden ? "block" : "none";
            }
            if (sidebar) {
                const willShowSidebar = sidebar.classList.contains("hidden");
                sidebar.classList.toggle("hidden");
                if (mainContent) {
                    if (willShowSidebar) {
                        mainContent.classList.add("hidden");
                    } else {
                        mainContent.classList.remove("hidden");
                    }
                }
            }
        });
    }

    const menuDropdownToggle = document.getElementById("menuDropdownToggle");
    const menuDropdownSub = document.getElementById("menuDropdownSub");
    const menuDropdownChevron = document.getElementById("menuDropdownChevron");

    if (menuDropdownToggle && menuDropdownSub) {
        menuDropdownToggle.addEventListener("click", function () {
            menuDropdownSub.classList.toggle("hidden");
            if (menuDropdownChevron) {
                menuDropdownChevron.classList.toggle("rotate-180");
            }
        });
    }

    const datatableSearch = document.getElementById("datatableSearch");
    const datatableBody = document.getElementById("datatableUsersBody");
    const datatableInfoText = document.getElementById("datatableInfoText");
    const datatablePageSize = document.getElementById("datatablePageSize");
    const datatablePagination = document.getElementById("datatablePagination");

    if (datatableSearch && datatableBody && datatableInfoText && datatablePageSize && datatablePagination) {
        const datatableRows = Array.from(datatableBody.querySelectorAll("tr"));
        const totalRows = datatableRows.length;
        let currentPage = 1;

        const getPageSize = function () {
            const value = parseInt(datatablePageSize.value, 10);
            if (Number.isNaN(value) || value <= 0) {
                return totalRows || 1;
            }
            return value;
        };

        const renderPagination = function (totalFiltered, pageSize) {
            const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize) || 1);
            if (currentPage > totalPages) {
                currentPage = totalPages;
            }

            let html = "";

            html += '<li class="page-item' + (currentPage === 1 ? " disabled" : "") + '">';
            html += '<button type="button" class="page-link bg-transparent border-slate-700 text-slate-300" data-page="prev">Prev</button>';
            html += "</li>";

            for (let page = 1; page <= totalPages; page++) {
                const isActive = page === currentPage;
                html += '<li class="page-item' + (isActive ? " active" : "") + '">';
                html += '<button type="button" class="page-link border-slate-700 ' + (isActive ? "bg-indigo-500 text-white" : "bg-transparent text-slate-300") + '" data-page="' + page + '">' + page + "</button>";
                html += "</li>";
            }

            html += '<li class="page-item' + (currentPage === totalPages ? " disabled" : "") + '">';
            html += '<button type="button" class="page-link bg-transparent border-slate-700 text-slate-300" data-page="next">Next</button>';
            html += "</li>";

            datatablePagination.innerHTML = html;
        };

        const applyDatatableFilterAndPaging = function () {
            const query = datatableSearch.value.trim().toLowerCase();
            const pageSize = getPageSize();
            const matchedRows = [];

            datatableRows.forEach(function (row) {
                const text = row.textContent.toLowerCase();
                if (text.indexOf(query) !== -1) {
                    matchedRows.push(row);
                }
            });

            const totalFiltered = matchedRows.length;
            const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize) || 1);
            if (currentPage > totalPages) {
                currentPage = totalPages;
            }

            datatableRows.forEach(function (row) {
                row.style.display = "none";
            });

            if (totalFiltered > 0) {
                const startIndex = (currentPage - 1) * pageSize;
                const endIndex = Math.min(startIndex + pageSize, totalFiltered);

                for (let i = startIndex; i < endIndex; i++) {
                    matchedRows[i].style.display = "";
                }

                datatableInfoText.textContent = "Menampilkan " + (startIndex + 1) + "–" + endIndex + " dari " + totalFiltered + " data";
            } else {
                datatableInfoText.textContent = "Menampilkan 0 dari " + totalRows + " data";
            }

            renderPagination(totalFiltered, pageSize);
        };

        datatableSearch.addEventListener("input", function () {
            currentPage = 1;
            applyDatatableFilterAndPaging();
        });

        datatablePageSize.addEventListener("change", function () {
            currentPage = 1;
            applyDatatableFilterAndPaging();
        });

        datatablePagination.addEventListener("click", function (event) {
            const target = event.target;
            if (!target || !target.dataset || !target.dataset.page) {
                return;
            }

            const pageValue = target.dataset.page;
            const pageSize = getPageSize();
            const query = datatableSearch.value.trim().toLowerCase();
            const matchedRows = [];

            datatableRows.forEach(function (row) {
                const text = row.textContent.toLowerCase();
                if (text.indexOf(query) !== -1) {
                    matchedRows.push(row);
                }
            });

            const totalFiltered = matchedRows.length;
            const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize) || 1);

            if (pageValue === "prev") {
                if (currentPage > 1) {
                    currentPage -= 1;
                }
            } else if (pageValue === "next") {
                if (currentPage < totalPages) {
                    currentPage += 1;
                }
            } else {
                const numericPage = parseInt(pageValue, 10);
                if (!Number.isNaN(numericPage)) {
                    currentPage = numericPage;
                }
            }

            if (currentPage < 1) {
                currentPage = 1;
            }
            if (currentPage > totalPages) {
                currentPage = totalPages;
            }

            applyDatatableFilterAndPaging();
        });

        applyDatatableFilterAndPaging();
    }

    const sweetAlertElement = document.getElementById("sweetAlert");
    const sweetAlertTitleElement = document.getElementById("sweetAlertTitle");
    const sweetAlertTextElement = document.getElementById("sweetAlertText");
    const sweetAlertIconElement = document.getElementById("sweetAlertIcon");
    const sweetAlertCancelElement = document.getElementById("sweetAlertCancel");
    const sweetAlertConfirmElement = document.getElementById("sweetAlertConfirm");
    const sweetAlertButtons = document.querySelectorAll("[data-sweet-alert]");
    let sweetAlertTimeoutId;

    const sweetAlertIcons = {
        success: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>',
        warning: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01M4.93 4.93A10.97 10.97 0 0112 3c2.98 0 5.7 1.17 7.68 3.07A10.97 10.97 0 0121 12a10.97 10.97 0 01-3.32 7.93A10.97 10.97 0 0112 23a10.97 10.97 0 01-7.07-2.6A10.97 10.97 0 011 12c0-2.98 1.17-5.7 3.07-7.68z"/></svg>',
        danger: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>'
    };

    function closeSweetAlert() {
        if (!sweetAlertElement) {
            return;
        }
        if (sweetAlertTimeoutId) {
            clearTimeout(sweetAlertTimeoutId);
            sweetAlertTimeoutId = null;
        }
        sweetAlertElement.classList.remove("active");
    }

    function openSweetAlert(variant, title, text, options) {
        const config = options || {};
        if (!sweetAlertElement) {
            return;
        }
        sweetAlertElement.classList.remove("sweet-alert-success", "sweet-alert-warning", "sweet-alert-danger");
        if (variant === "success" || variant === "warning" || variant === "danger") {
            sweetAlertElement.classList.add("sweet-alert-" + variant);
        }
        if (sweetAlertTitleElement) {
            sweetAlertTitleElement.textContent = title || "";
        }
        if (sweetAlertTextElement) {
            sweetAlertTextElement.textContent = text || "";
        }
        if (sweetAlertIconElement && sweetAlertIcons[variant]) {
            sweetAlertIconElement.innerHTML = sweetAlertIcons[variant];
        }
        sweetAlertElement.classList.add("active");
        if (sweetAlertTimeoutId) {
            clearTimeout(sweetAlertTimeoutId);
            sweetAlertTimeoutId = null;
        }
        if (config.autoclose) {
            const timeout = typeof config.timeout === "number" ? config.timeout : 2500;
            sweetAlertTimeoutId = setTimeout(function () {
                closeSweetAlert();
            }, timeout);
        }
    }

    if (sweetAlertButtons && sweetAlertElement) {
        sweetAlertButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                const variant = button.getAttribute("data-sweet-variant") || "success";
                const title = button.getAttribute("data-sweet-title") || "";
                const text = button.getAttribute("data-sweet-text") || "";
                const autoClose = button.getAttribute("data-sweet-autoclose") === "true";
                const timeoutAttr = button.getAttribute("data-sweet-timeout");
                const timeoutValue = timeoutAttr ? parseInt(timeoutAttr, 10) : undefined;
                openSweetAlert(variant, title, text, { autoclose: autoClose, timeout: timeoutValue });
            });
        });
    }

    if (sweetAlertCancelElement) {
        sweetAlertCancelElement.addEventListener("click", function () {
            closeSweetAlert();
        });
    }

    if (sweetAlertConfirmElement) {
        sweetAlertConfirmElement.addEventListener("click", function () {
            closeSweetAlert();
        });
    }

    if (sweetAlertElement) {
        sweetAlertElement.addEventListener("click", function (event) {
            if (event.target === sweetAlertElement) {
                closeSweetAlert();
            }
        });
    }

    if (window.Swal) {
        const sweetAlert2Buttons = document.querySelectorAll("[data-swal2]");
        sweetAlert2Buttons.forEach(function (button) {
            button.addEventListener("click", function () {
                const icon = button.getAttribute("data-swal-icon") || "info";
                const title = button.getAttribute("data-swal-title") || "";
                const text = button.getAttribute("data-swal-text") || "";
                const showCancel = button.getAttribute("data-swal-show-cancel") === "true";
                const confirmText = button.getAttribute("data-swal-confirm-text") || "OK";
                const cancelText = button.getAttribute("data-swal-cancel-text") || "Batal";
                Swal.fire({
                    icon: icon,
                    title: title,
                    text: text,
                    showCancelButton: showCancel,
                    confirmButtonText: confirmText,
                    cancelButtonText: cancelText,
                    confirmButtonColor: "#6366f1",
                    cancelButtonColor: "#4b5563",
                    background: document.body.classList.contains("light") ? "#f9fafb" : "#020617",
                    color: document.body.classList.contains("light") ? "#0f172a" : "#e5e7eb"
                });
            });
        });
    }

    if (window.toastr) {
        toastr.options.positionClass = "toast-bottom-right";
        toastr.options.progressBar = true;
        toastr.options.closeButton = true;
        toastr.options.timeOut = 2500;

        const toastrButtons = document.querySelectorAll("[data-toastr]");
        toastrButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                const type = button.getAttribute("data-toastr-type") || "info";
                const title = button.getAttribute("data-toastr-title") || "";
                const message = button.getAttribute("data-toastr-message") || "";
                const position = button.getAttribute("data-toastr-position");

                const baseOptions = {
                    progressBar: toastr.options.progressBar,
                    closeButton: toastr.options.closeButton,
                    timeOut: toastr.options.timeOut,
                    positionClass: toastr.options.positionClass
                };

                if (position) {
                    baseOptions.positionClass = position;
                }

                if (typeof toastr[type] === "function") {
                    toastr[type](message, title, baseOptions);
                } else {
                    toastr.info(message, title, baseOptions);
                }

                if (position) {
                    const container = document.getElementById("toast-container");
                    if (container) {
                        container.classList.remove(
                            "toast-top-right",
                            "toast-top-left",
                            "toast-top-center",
                            "toast-top-full-width",
                            "toast-bottom-right",
                            "toast-bottom-left",
                            "toast-bottom-center",
                            "toast-bottom-full-width"
                        );
                        container.classList.add(position);
                    }
                }
            });
        });
    }
});
