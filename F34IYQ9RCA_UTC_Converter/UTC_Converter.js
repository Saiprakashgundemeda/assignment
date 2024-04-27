/*! jQuery v3.5.1 | (c) JS Foundation and other contributors | jquery.org/license */
function stInit() {
    $(".primary .nav .parent a .open-sub").click(function(n) {
        n.preventDefault();
        $(this).closest(".parent").hasClass("active") ? ($(this).parent().next(".sub").slideUp(600), $(this).closest(".parent").removeClass("active")) : ($(this).parent().next(".sub").slideDown(600), $(this).closest(".parent").addClass("active"))
    })
}

function initFieldSearch() {
    function l(n) {
        if (n && !i) {
            n = n.replace(/\s+/g, " ").trim().toLowerCase();
            h.classList.add("hide");
            c.classList.remove("hide");
            u += 1;
            const t = u;
            $.ajax({
                type: "GET",
                url: "/api/search/timezone",
                data: {
                    query: n
                }
            }).done(function(r) {
                if (f < t) f = t;
                else return;
                i || y(n, r);
                c.classList.add("hide");
                h.classList.remove("hide")
            })
        }
    }

    function v(n) {
        n.Place = n.Abbreviation + " (" + n.Name + ")";
        const t = (new moment).utc().add(n.Offset, "h");
        return n.Time = st.formatTime(t.hour(), t.minute()), n
    }

    function r() {
        const n = document.getElementById("autocomplete-list");
        n && n.remove()
    }

    function y(u, f) {
        r();
        f && f.forEach(n => v(n));
        let o, e = u;
        t = -1;
        o = document.createElement("DIV");
        o.setAttribute("id", "autocomplete-list");
        o.setAttribute("class", "autocomplete-list");
        n.parentNode.appendChild(o);
        for (let t = 0; t < f.length; t++) {
            e = document.createElement("DIV");
            e.setAttribute("class", "list-group-item");
            const r = document.createElement("DIV");
            r.setAttribute("class", "text");
            const s = f[t].city ? f[t].Name : f[t].Place,
                h = new RegExp(u, "gi"),
                c = new RegExp(u, "i");
            r.innerHTML = s.replace(h, `<span class="highlight">${s.match(c)}</span>`);
            e.innerHTML += `<input type='hidden' value='${f[t].Id}'>`;
            e.appendChild(r);
            e.innerHTML += `<span class='quick-search-time'>${f[t].Time}</span>`;
            e.addEventListener("mousedown", function() {
                const [r] = this.getElementsByTagName("input"), t = r.value;
                t && (n.value = "", i = !0, globalFunctions.updateLocation(t))
            });
            o.appendChild(e)
        }
    }

    function p(n) {
        const r = document.getElementById("autocomplete-list");
        if (r) {
            const i = r.querySelectorAll(".list-group-item");
            if (n.keyCode === 40) t++, a(i);
            else if (n.keyCode === 38) t--, a(i);
            else if (n.keyCode === 13) {
                n.preventDefault();
                const r = document.createEvent("MouseEvents");
                r.initEvent("mousedown", !0, !0);
                t > -1 ? i && i[t].dispatchEvent(r) : i && i[0].dispatchEvent(r)
            }
        }
    }

    function a(n) {
        if (!n) return !1;
        w(n);
        t >= n.length && (t = 0);
        t < 0 && (t = n.length - 1);
        n[t].classList.add("autocomplete-active")
    }

    function w(n) {
        for (let t = 0; t < n.length; t++) n[t].classList.remove("autocomplete-active")
    }
    let t, u = 0,
        f = 0,
        i = !0,
        e;
    const n = document.getElementById("time-search"),
        [o] = document.getElementsByClassName("add-tz-icon"),
        [s] = document.getElementsByClassName("converter-menu"),
        [h] = document.getElementsByClassName("add-tz-icon"),
        [c] = document.getElementsByClassName("icon-spinner");
    o.addEventListener("mousedown", () => {
        const i = document.getElementById("autocomplete-list");
        if (i && i && n.value !== "") {
            const r = document.createEvent("MouseEvents");
            r.initEvent("mousedown", !0, !0);
            const n = i.querySelectorAll(".list-group-item");
            t > -1 ? n && n[t].dispatchEvent(r) : n && n[0].dispatchEvent(r)
        }
    });
    o.addEventListener("click", () => {
        window.innerWidth < 480 && (n.parentElement.style.width = "100%", $(".converter-menu").addClass("hide")), n.focus()
    });
    n.addEventListener("input", () => {
        n.value ? (r(), i = !1, clearTimeout(e), e = setTimeout(() => l(n.value), 200)) : (i = !0, r())
    });
    n.addEventListener("blur", () => {
        window.innerWidth < 480 && (n.parentElement.style.width = "80%"), r(), setTimeout(() => {
            s.classList.remove("hide")
        }, 200)
    });
    n.addEventListener("focus", () => {
        window.innerWidth < 480 && (n.parentElement.style.width = "100%", s.classList.add("hide")), r(), n.value ? (i = !1, l(n.value)) : i = !0
    });
    n.addEventListener("keydown", n => {
        p(n)
    });
    document.addEventListener("click", () => {
        const i = document.activeElement,
            t = document.getElementById("autocomplete-list");
        t && t && n.value !== "" && n !== i && r()
    })
}

function handleTouchStart(n) {
    const i = n.target.closest(".table-time"),
        r = [...converterView.children].indexOf(i.parentNode);
    tableIndex >= 0 && tableIndex !== r && tableToDefaultPosition(tableIndex);
    const [t] = n.touches || n.originalEvent.touches;
    xStart = t.clientX;
    yStart = t.clientY
}

function handleTouchMove(n) {
    if (!n.target.classList.contains("noUi-handle") && xStart && yStart) {
        const t = xStart - n.touches[0].clientX,
            i = yStart - n.touches[0].clientY;
        if (Math.abs(t) > Math.abs(i)) return t;
        scrollUpDown = !0
    }
}

function handleTouchEnd(n) {
    document.body.classList.remove("stop-scrolling");
    scrollUpDown = !1;
    const t = n.target.closest(".table-time"),
        r = [...converterView.children].indexOf(t.parentNode),
        i = new WebKitCSSMatrix(t.style.transform);
    if (i.m41 < distanceDelete) {
        t.addEventListener("transitionend", function() {
            deleteTable(t)
        });
        t.classList.remove("no-transition");
        t.classList.add("transition");
        t.style.transform = `translate(-${tableWidth}px)`;
        return
    }
    i.m41 >= -100 && i.m41 !== -100 ? (tableToDefaultPosition(r), tableIndex = -1) : i.m41 <= -100 && (t.classList.remove("no-transition"), t.classList.add("transition"), t.style.transform = "translate(-100px)", tableIndex = r)
}

function deleteTable(n) {
    n.parentNode.remove();
    globalFunctions.updateLocation()
}

function tableToDefaultPosition(n) {
    if (!(n < 0)) {
        const t = document.querySelectorAll(".table-time");
        t[n].classList.remove("no-transition");
        t[n].classList.add("transition");
        t[n].style.transform = "translate(0)"
    }
}

function moveTable(n, t) {
    currentTransition = new WebKitCSSMatrix(n.style.transform).m41;
    const i = tableIndex === [...converterView.children].indexOf(n.parentNode);
    (currentTransition && (scrollUpDown = !1, document.body.classList.add("stop-scrolling")), tableIndex >= 0 && !i && (tableToDefaultPosition(tableIndex), tableIndex = -1), t < 0 && !i || scrollUpDown) || i && currentTransition + 100 >= 97 || (n.classList.remove("transition"), n.classList.add("no-transition"), n.style.transform = `translate(${i?-100+Math.floor(-t*1.2):Math.floor(-t*1.2)}px)`)
}

function resizeTable(n) {
    const [r] = n, t = r.target;
    tableWidth = t.offsetWidth;
    const i = Math.floor(t.getBoundingClientRect().height) || t.offsetHeight,
        u = t.closest(".wrapper"),
        f = u.querySelector(".container-delete");
    f.setAttribute("style", `width: ${tableWidth-5}px; height: ${i}px; transform: translateY(-${i}px)`)
}

function setTableForMobile(n) {
    n.forEach(function(n, t) {
        t === 0 && (tableWidth = n.offsetWidth, distanceDelete = -tableWidth + tableWidth / 4);
        n.style.zIndex = "1";
        n.style.background = lightTheme ? bgColorTableLight : bgColorTableDark;
        n.classList.add("transition");
        const i = document.createElement("div"),
            f = Math.floor(n.getBoundingClientRect().height) || n.offsetHeight;
        i.setAttribute("data-height", `${f}`);
        i.classList.add("container-delete");
        const u = document.createElement("p");
        u.innerHTML = "Delete";
        i.appendChild(u);
        const r = document.createElement("div");
        r.classList.add("wrapper");
        document.getElementById("converter-view").replaceChild(r, n);
        r.appendChild(n);
        r.appendChild(i);
        new ResizeObserver(resizeTable).observe(n)
    });
    const t = document.querySelectorAll(".container-delete");
    t.forEach(function(n) {
        const [i] = n.childNodes, t = +n.getAttribute("data-height");
        n.setAttribute("style", `width: ${tableWidth-5}px; height: ${t}px; transform: translateY(-${t}px)`);
        i.addEventListener("click", function(n) {
            const i = n.target.closest(".wrapper"),
                t = i.querySelector(".table-time");
            t.addEventListener("transitionend", function() {
                deleteTable(t)
            });
            t.classList.remove("no-transition");
            t.classList.add("transition");
            t.style.transform = `translate(-${tableWidth}px)`
        })
    })
}

function converterReady() {
    function g() {
        let n = $(".table-time input.time").data("offset");
        if (r) selectedDate = moment(r[0], "MMM-D-YYYY");
        else if (!isNaN(n)) {
            const t = new Date,
                f = t.getTime() + t.getTimezoneOffset() * 6e4,
                e = new Date(f + 36e5 * n),
                i = moment(e),
                r = i.minute() % 30,
                u = 30 - r;
            selectedDate = moment(i).add(u < 15 ? u : -r, "minutes");
            $(".table-time input.time.format12:first").val() || ($(".table-time input.time.format12:first").val(selectedDate.format("h:mm a")), $(".table-time input.time.format24:first").val(selectedDate.format("H:mm")))
        }
        $("body").scrollspy({
            target: ".sub-nav",
            offset: 160
        });
        $("#date-picker input, #share-date-picker input").val(r ? selectedDate.format(s) : moment().format(s));
        $("#date-picker, #share-date-picker").datepicker({
            autoclose: !0,
            todayHighlight: !0,
            format: "M d, yyyy"
        });
        st();
        nt();
        tt();
        initFieldSearch();
        $(".table-time input.time:first").trigger("keyup")
    }

    function nt() {
        const n = ".panel-body, .draggable-indicator",
            [t] = $("#converter-view");
        Sortable.create(t, {
            animation: 150,
            handle: ".draggable-indicator",
            onSort: function() {
                const n = h();
                window.history.pushState(null, "", n);
                a()
            },
            preventOnFilter: !1,
            forceFallback: !0,
            onStart: function() {
                $(n).css("cursor", "grabbing")
            },
            onEnd: function() {
                $(n).css("cursor", "")
            }
        });
        $(".table-time").prepend('<div class="draggable-indicator">' + et() + "<\/div>")
    }

    function tt() {
        for (var n, t = document.getElementsByClassName("slider"), i = 0; i < t.length; i++) {
            n = t[i];
            noUiSlider.create(n, {
                animate: !1,
                start: +n.getAttribute("data-val"),
                range: {
                    min: 0,
                    max: 95
                },
                pips: e
            });
            n.noUiSlider.on("slide", function(n) {
                it(this.target, +n[0], t)
            })
        }
    }

    function it(n, t) {
        var o = n.closest(".table-time"),
            r = $(o).find("input.time:not(.st-hide)"),
            f = moment(0),
            e, u;
        if (f.add(Math.floor(t) / 4, "hours"), e = !1, u = r.hasClass("format12") ? f.utc().format("h:mm a") : f.utc().format("H:mm"), u !== r.val() && (r.val(u), r.text(u), e = !0), e) {
            const n = $(o).find(".tz-date");
            i({
                timeString: r.val(),
                date: n.data("date"),
                offset: r.data("offset"),
                input: r.get(0),
                ignoreOriginalSlider: !0
            })
        }
    }

    function h(n) {
        var r = c(n),
            t = $.grep(location.pathname.split("/"), function(n) {
                return n
            }),
            i = "/";
        return r ? (t[1] = r, i += t.join("/")) : i += t[0], i
    }

    function c(n) {
        var r = $(".table-time"),
            t = [],
            i = "";
        $.each(r, function(n, i) {
            t.push($(i).data("id"))
        });
        n && t.push(n);
        for (let n = 0; n < t.length; n++) i += n === 0 ? t[n] : n === 1 ? "-to-" + t[n] : "-" + t[n];
        return i
    }

    function l(n, t) {
        var i = moment($(".table-time input.time:first").val(), ["HH:mm", "h:mm a"]),
            r = location.origin + "/" + location.pathname.split("/")[1] + "/" + c(),
            u, f;
        return t && (u = moment($("#share-date-picker input").val()).format("MMM-D-YYYY").toLowerCase(), r += "/" + u), n && (f = localStorage.timeFormat === "format24" ? i.format("HH-mm") : i.minutes() === 0 ? i.format("ha") : i.format("h-mma"), r += "/" + f), r
    }

    function n() {
        var n = $("#include-time")[0].checked,
            t = $("#include-date")[0].checked,
            i = l(n, t);
        $("#share-url").val(i)
    }

    function rt(n) {
        $(".table-view tbody tr").removeClass("active");
        $(".table-view tbody tr:nth-child(" + (n + 1) + ")").addClass("active")
    }

    function i({
        timeString: e,
        date: i,
        offset: f,
        input: u,
        ignoreOriginalSlider: r
    }) {
        const o = moment((i || selectedDate.format(t)) + " " + e, [`${t} HH:mm`, `${t} h:mm a`, ]);
        if (o.isValid()) {
            o.add(-f, "hours");
            const t = $("input.time, span.time");
            $.each(t, function(n, t) {
                const i = $(t),
                    e = i.closest(".table-time").find(".tz-date"),
                    f = o.clone(),
                    s = i.data("offset");
                f.add(s, "hours");
                i[0] === u && u ? r || v(i, f) : (i.timepicker("setTime", f.toDate()), v(i, f));
                i.hasClass("format12") && ut(e, f)
            });
            const i = moment($(".table-time input.time:first").val(), ["HH:mm", "h:mm a"]);
            a();
            n();
            rt(i.hour())
        }
    }

    function ut(n, i) {
        n.length && (n.text(i.format(u)), n.data("date", i.format(t)))
    }

    function a() {
        const n = $(".table-time");
        if (n.length) {
            const [i] = $(".tz-date"), t = moment($(i)[0] ? $(i)[0].innerText : undefined, u);
            for (let i = 0; i < n.length; i++) {
                const e = n[i],
                    f = moment($(e).find(".tz-date").html(), u),
                    r = $(e).find(".tz-date");
                b(t, f) ? (r.removeClass("highlight-text-ahead"), r.removeClass("highlight-text-behind")) : (d(t, f) && r.addClass("highlight-text-behind"), k(t, f) && r.addClass("highlight-text-ahead"))
            }
        }
    }

    function v(n, t) {
        var f = moment.duration({
                minutes: t.minutes(),
                hours: t.hours()
            }).asMinutes(),
            r = Math.round(f / 15),
            i = n.closest(".table-time").find(".slider"),
            u;
        i.get(0) && i.get(0).noUiSlider ? (u = Math.abs(+i.get(0).noUiSlider.get() - r), u >= 1 && i.get(0).noUiSlider.set(r)) : i.attr("data-val", r)
    }

    function ft() {
        for (var t = document.getElementsByClassName("slider"), n = 0; n < t.length; n++) t[n].noUiSlider.pips(e)
    }

    function et(n) {
        for (var t, n = n || {}, s = n.sideLength || 32, r = n.dotWidth || 4, u = n.offset || 8, e = undefined === n.initialX ? 4 : n.initialX, o = undefined === n.initialY ? 4 : n.initialY, f = '<svg viewBox="0 0 16 128">', i = 0; i < 2; i++)
            for (t = 0; t < 16; t++) f += '<rect x="' + (e + i * u) + '" y="' + (o + t * u) + '" width="' + r + '" height="' + r + '"  />';
        return f + "<\/svg>"
    }

    function ot() {
        $("input.time").timepicker("hide")
    }

    function st() {
        $("input.time").each(function(n, t) {
            var i = $(t),
                r = moment(i.val(), ["HH:mm", "h:mm a"]);
            i.timepicker({
                className: "st-timepicker",
                timeFormat: i.hasClass("format12") ? "g:i a" : "G:i"
            });
            i.timepicker("setTime", r.toDate())
        })
    }
    var p = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        r = location.pathname.match("[a-zA-Z]{3}-[0-9]{1,2}-[0-9]{4}"),
        e, y;
    const o = document.querySelectorAll(".table-time"),
        t = "YYYY-MM-DD",
        u = "ddd, MMM D",
        s = "MMM D, YYYY",
        f = document.querySelectorAll(".delete"),
        w = document.getElementById("converter");
    e = {
        density: 4,
        mode: "values",
        values: p > 480 ? [0, 12, 24, 36, 48, 60, 72, 84] : [0, 24, 48, 72],
        format: {
            to: function(n) {
                var t = moment(0);
                return t.add(n / 4, "hours"), t.utc().format(localStorage.timeFormat === "format24" ? "H" : "ha")
            },
            from: function(n) {
                return n
            }
        }
    };
    const b = function(n, t) {
            return n.dayOfYear() === moment(t).dayOfYear()
        },
        k = function(n, t) {
            return n.isBefore(t)
        },
        d = function(n, t) {
            return n.isAfter(t)
        };
    globalFunctions.updateLocation = function(n) {
        location.pathname = h(n)
    };
    for (y of document.querySelectorAll(".slider-wrap")) y.addEventListener("mousedown", ot, !0);
    $(document).on("showTimepicker.timepicker", "input.time", function(n) {
        const t = $(".st-timepicker:visible");
        if (t.length === 1) {
            var i = n.currentTarget.getBoundingClientRect().width;
            t.css("width", i + "px")
        }
    });
    $("input.time").on("keyup", function() {
        var n = $(this);
        i({
            timeString: n.val(),
            offset: n.data("offset"),
            input: n[0]
        })
    });
    $("input.time").on("click", function(n) {
        const {
            target: t
        } = n, i = t.selectionEnd - t.selectionStart;
        i === 0 && t.select()
    });
    $(document).on("click", ".add-time-wrap .list-group-item", function() {
        var n = $(this).data("id");
        globalFunctions.updateLocation(n)
    });
    $("input.time").on("changeTime.timepicker", function(n) {
        i({
            timeString: this.value,
            offset: $(n.currentTarget).data("offset"),
            input: n.currentTarget
        })
    });
    $(".nav-pills a[href*=\\#]:not([href=\\#])").on("click", function() {
        if (location.pathname.replace(/^\//, "") === this.pathname.replace(/^\//, "") && location.hostname === this.hostname) {
            var n = $(this.hash);
            if (n = n.length ? n : $("[name=" + this.hash.slice(1) + "]"), n.length) {
                const t = $("header.header").outerHeight() - 60,
                    i = n[0].getBoundingClientRect().top + window.pageYOffset + -110 - t;
                return window.scrollTo({
                    top: i
                }), !1
            }
        }
    });
    f.forEach(function(n) {
        n.addEventListener("click", function(n) {
            n.target.closest(".table-time").remove();
            globalFunctions.updateLocation()
        })
    });
    deviceType === devices.tablet || deviceType === devices.mobile ? f.forEach(function(n) {
        n.classList.add("hide")
    }) : (f.forEach(function(n) {
        n.classList.remove("hide")
    }), w.style.overflow = "visible");
    (deviceType === devices.mobile || deviceType === devices.tablet) && (window.addEventListener("load", function() {
        setTableForMobile(o)
    }), o.forEach(function(n) {
        n.addEventListener("touchstart", handleTouchStart);
        n.addEventListener("touchmove", function(t) {
            moveTable(n, handleTouchMove(t))
        });
        n.addEventListener("touchend", handleTouchEnd)
    }));
    $(".table-time .bs-callout-warning .close").on("click", function() {
        var n = $(this);
        n.closest(".bs-callout-warning").remove()
    });
    $(".table-view tbody tr").on("click", function() {
        var n = $(this);
        n.hasClass("active") ? n.removeClass("active") : ($(".table-view tbody tr").removeClass("active"), n.addClass("active"));
        i({
            timeString: n.children()[0].innerText,
            offset: $(".table-time input.time:first").data("offset")
        })
    });
    $("#permanent-link").on("click", function() {
        n();
        setTimeout(function() {
            $("#share-url").select()
        }, 200)
    });
    $("#include-time").on("click", function() {
        n()
    });
    $("#include-date").on("click", function() {
        n()
    });
    $(".include-time-box").on("changeTime.timepicker", function() {
        $("#include-time")[0].checked = !0
    });
    g();
    $("#date-picker").on("changeDate", function(n) {
        $("#share-date-picker input").val(moment(n.date).format("MMM D, YYYY"));
        location.href = l(!0, !0)
    });
    $("#share-date-picker").on("changeDate", function() {
        $("#include-date")[0].checked = !0;
        n()
    });
    $("#date-picker input, #share-date-picker input").on("focus", function() {
        $(this).blur()
    });
    $(".hour-switch").on("change", ft)
}

function changeTimeToOffset(n, t, i) {
    let r = changeToObjMoment(n);
    return r.add(t, "hours"), timeFormatInHour(r.toDate(), i)
}

function changeTimeSubtractOffset(n, t, i) {
    let r = changeToObjMoment(n);
    return r.add(-t, "hours"), timeFormatInHour(r.toDate(), i)
}

function changeDateToOffset(n, t, i) {
    let r = changeToObjMoment(n);
    return r.add(t, "hours"), i ? r.format("MMM-DD-YYYY") : r.format("ddd, MMM DD YYYY")
}

function changeToObjMoment(n) {
    return moment(selectedDate.format("YYYY-MM-DD ") + n, ["YYYY-MM-DD HH:mm", "YYYY-MM-DD h:mm a"])
}

function timeFormatInHour(n, t) {
    const r = localStorage.timeFormat,
        i = t ? "-" : ":";
    return moment(n).format(r === "format12" ? `h${i}mma` : `H${i}mm`)
}

function updateContent() {
    const n = document.querySelectorAll(".dst-clock"),
        [t] = logo.children;
    if (t.setAttribute("src", `${lightTheme?"/images/logo.png":"/images/logo-dark.png"}`), n.forEach(function(n) {
            n.setAttribute("src", `${n.getAttribute("src").replace(`/${lightTheme?pathImageClock.dark:pathImageClock.light}/`,`/${lightTheme?pathImageClock.light:pathImageClock.dark}/`)}`)
        }), deviceType !== devices.desktop) {
        const n = document.querySelectorAll(".table-time");
        n.forEach(function(n) {
            n.style.backgroundColor = lightTheme ? bgColorTableLight : bgColorTableDark
        })
    }
}

function setBtn() {
    const n = btnTheme.querySelector(".moon"),
        t = btnTheme.querySelector(".sun");
    lightTheme ? (t.classList.add("hide"), n.classList.remove("hide")) : (t.classList.remove("hide"), n.classList.add("hide"));
    btnTheme.setAttribute("title", `Switch to ${lightTheme?themes.dark:themes.light} mode`)
}

function modeSwitch() {
    lightTheme ? (lightTheme = !1, localStorage.themeMode = themes.dark, document.body.classList.remove(`${themes.light}`), document.body.classList.add(`${themes.dark}`), document.cookie = `_theme=${themes.dark}; ${pathConverter}`) : (lightTheme = !0, localStorage.themeMode = themes.light, document.body.classList.remove(`${themes.dark}`), document.cookie = `_theme= ; ${pathConverter}; expires=Thu, 01 Jan 1970 00:00:00 UTC;`);
    setBtn();
    updateContent()
}! function(n, t) {
    "use strict";
    "object" == typeof module && "object" == typeof module.exports ? module.exports = n.document ? t(n, !0) : function(n) {
        if (!n.document) throw new Error("jQuery requires a window with a document");
        return t(n)
    } : t(n)
}("undefined" != typeof window ? window : this, function(n, t) {
    "use strict";

    function br(n, t, i) {
        var r, e, u = (i = i || f).createElement("script");
        if (u.text = n, t)
            for (r in oe)(e = t[r] || t.getAttribute && t.getAttribute(r)) && u.setAttribute(r, e);
        i.head.appendChild(u).parentNode.removeChild(u)
    }

    function ut(n) {
        return null == n ? n + "" : "object" == typeof n || "function" == typeof n ? ri[pr.call(n)] || "object" : typeof n
    }

    function pi(n) {
        var t = !!n && "length" in n && n.length,
            i = ut(n);
        return !u(n) && !rt(n) && ("array" === i || 0 === t || "number" == typeof t && 0 < t && t - 1 in n)
    }

    function c(n, t) {
        return n.nodeName && n.nodeName.toLowerCase() === t.toLowerCase()
    }

    function bi(n, t, r) {
        return u(t) ? i.grep(n, function(n, i) {
            return !!t.call(n, i, n) !== r
        }) : t.nodeType ? i.grep(n, function(n) {
            return n === t !== r
        }) : "string" != typeof t ? i.grep(n, function(n) {
            return -1 < ii.call(t, n) !== r
        }) : i.filter(t, n, r)
    }

    function uu(n, t) {
        while ((n = n[t]) && 1 !== n.nodeType);
        return n
    }

    function et(n) {
        return n
    }

    function fi(n) {
        throw n;
    }

    function fu(n, t, i, r) {
        var f;
        try {
            n && u(f = n.promise) ? f.call(n).done(t).fail(i) : n && u(f = n.then) ? f.call(n, t, i) : t.apply(void 0, [n].slice(r))
        } catch (n) {
            i.apply(void 0, [n])
        }
    }

    function oi() {
        f.removeEventListener("DOMContentLoaded", oi);
        n.removeEventListener("load", oi);
        i.ready()
    }

    function ce(n, t) {
        return t.toUpperCase()
    }

    function y(n) {
        return n.replace(se, "ms-").replace(he, ce)
    }

    function bt() {
        this.expando = i.expando + bt.uid++
    }

    function ou(n, t, i) {
        var u, r;
        if (void 0 === i && 1 === n.nodeType)
            if (u = "data-" + t.replace(ae, "-$&").toLowerCase(), "string" == typeof(i = n.getAttribute(u))) {
                try {
                    i = "true" === (r = i) || "false" !== r && ("null" === r ? null : r === +r + "" ? +r : le.test(r) ? JSON.parse(r) : r)
                } catch (n) {}
                o.set(n, t, i)
            } else i = void 0;
        return i
    }

    function hu(n, t, r, u) {
        var s, h, c = 20,
            l = u ? function() {
                return u.cur()
            } : function() {
                return i.css(n, t, "")
            },
            o = l(),
            e = r && r[3] || (i.cssNumber[t] ? "" : "px"),
            f = n.nodeType && (i.cssNumber[t] || "px" !== e && +o) && kt.exec(i.css(n, t));
        if (f && f[3] !== e) {
            for (o /= 2, e = e || f[3], f = +o || 1; c--;) i.style(n, t, f + e), (1 - h) * (1 - (h = l() / o || .5)) <= 0 && (c = 0), f /= h;
            f *= 2;
            i.style(n, t, f + e);
            r = r || []
        }
        return r && (f = +f || +o || 0, s = r[1] ? f + (r[1] + 1) * r[2] : +r[2], u && (u.unit = e, u.start = f, u.end = s)), s
    }

    function ht(n, t) {
        for (var h, f, a, s, c, l, e, o = [], u = 0, v = n.length; u < v; u++)(f = n[u]).style && (h = f.style.display, t ? ("none" === h && (o[u] = r.get(f, "display") || null, o[u] || (f.style.display = "")), "" === f.style.display && dt(f) && (o[u] = (e = c = s = void 0, c = (a = f).ownerDocument, l = a.nodeName, (e = ki[l]) || (s = c.body.appendChild(c.createElement(l)), e = i.css(s, "display"), s.parentNode.removeChild(s), "none" === e && (e = "block"), ki[l] = e)))) : "none" !== h && (o[u] = "none", r.set(f, "display", h)));
        for (u = 0; u < v; u++) null != o[u] && (n[u].style.display = o[u]);
        return n
    }

    function s(n, t) {
        var r;
        return r = "undefined" != typeof n.getElementsByTagName ? n.getElementsByTagName(t || "*") : "undefined" != typeof n.querySelectorAll ? n.querySelectorAll(t || "*") : [], void 0 === t || t && c(n, t) ? i.merge([n], r) : r
    }

    function di(n, t) {
        for (var i = 0, u = n.length; i < u; i++) r.set(n[i], "globalEval", !t || r.get(t[i], "globalEval"))
    }

    function vu(n, t, r, u, f) {
        for (var e, o, p, a, w, v, c = t.createDocumentFragment(), y = [], l = 0, b = n.length; l < b; l++)
            if ((e = n[l]) || 0 === e)
                if ("object" === ut(e)) i.merge(y, e.nodeType ? [e] : e);
                else if (au.test(e)) {
            for (o = o || c.appendChild(t.createElement("div")), p = (cu.exec(e) || ["", ""])[1].toLowerCase(), a = h[p] || h._default, o.innerHTML = a[1] + i.htmlPrefilter(e) + a[2], v = a[0]; v--;) o = o.lastChild;
            i.merge(y, o.childNodes);
            (o = c.firstChild).textContent = ""
        } else y.push(t.createTextNode(e));
        for (c.textContent = "", l = 0; e = y[l++];)
            if (u && -1 < i.inArray(e, u)) f && f.push(e);
            else if (w = st(e), o = s(c.appendChild(e), "script"), w && di(o), r)
            for (v = 0; e = o[v++];) lu.test(e.type || "") && r.push(e);
        return c
    }

    function ct() {
        return !0
    }

    function lt() {
        return !1
    }

    function we(n, t) {
        return n === function() {
            try {
                return f.activeElement
            } catch (n) {}
        }() == ("focus" === t)
    }

    function gi(n, t, r, u, f, e) {
        var o, s;
        if ("object" == typeof t) {
            for (s in "string" != typeof r && (u = u || r, r = void 0), t) gi(n, s, r, u, t[s], e);
            return n
        }
        if (null == u && null == f ? (f = r, u = r = void 0) : null == f && ("string" == typeof r ? (f = u, u = void 0) : (f = u, u = r, r = void 0)), !1 === f) f = lt;
        else if (!f) return n;
        return 1 === e && (o = f, (f = function(n) {
            return i().off(n), o.apply(this, arguments)
        }).guid = o.guid || (o.guid = i.guid++)), n.each(function() {
            i.event.add(this, t, f, u, r)
        })
    }

    function hi(n, t, u) {
        u ? (r.set(n, t, !1), i.event.add(n, t, {
            namespace: !1,
            handler: function(n) {
                var o, e, f = r.get(this, t);
                if (1 & n.isTrigger && this[t]) {
                    if (f.length)(i.event.special[t] || {}).delegateType && n.stopPropagation();
                    else if (f = k.call(arguments), r.set(this, t, f), o = u(this, t), this[t](), f !== (e = r.get(this, t)) || o ? r.set(this, t, !1) : e = {}, f !== e) return n.stopImmediatePropagation(), n.preventDefault(), e.value
                } else f.length && (r.set(this, t, {
                    value: i.event.trigger(i.extend(f[0], i.Event.prototype), f.slice(1), this)
                }), n.stopImmediatePropagation())
            }
        })) : void 0 === r.get(n, t) && i.event.add(n, t, ct)
    }

    function pu(n, t) {
        return c(n, "table") && c(11 !== t.nodeType ? t : t.firstChild, "tr") && i(n).children("tbody")[0] || n
    }

    function ge(n) {
        return n.type = (null !== n.getAttribute("type")) + "/" + n.type, n
    }

    function no(n) {
        return "true/" === (n.type || "").slice(0, 5) ? n.type = n.type.slice(5) : n.removeAttribute("type"), n
    }

    function wu(n, t) {
        var u, s, f, h, c, e;
        if (1 === t.nodeType) {
            if (r.hasData(n) && (e = r.get(n).events))
                for (f in r.remove(t, "handle events"), e)
                    for (u = 0, s = e[f].length; u < s; u++) i.event.add(t, f, e[f][u]);
            o.hasData(n) && (h = o.access(n), c = i.extend({}, h), o.set(t, c))
        }
    }

    function at(n, t, f, o) {
        t = yr(t);
        var a, b, l, v, h, y, c = 0,
            p = n.length,
            d = p - 1,
            w = t[0],
            k = u(w);
        if (k || 1 < p && "string" == typeof w && !e.checkClone && ke.test(w)) return n.each(function(i) {
            var r = n.eq(i);
            k && (t[0] = w.call(this, i, r.html()));
            at(r, t, f, o)
        });
        if (p && (b = (a = vu(t, n[0].ownerDocument, !1, n, o)).firstChild, 1 === a.childNodes.length && (a = b), b || o)) {
            for (v = (l = i.map(s(a, "script"), ge)).length; c < p; c++) h = a, c !== d && (h = i.clone(h, !0, !0), v && i.merge(l, s(h, "script"))), f.call(n[c], h, c);
            if (v)
                for (y = l[l.length - 1].ownerDocument, i.map(l, no), c = 0; c < v; c++) h = l[c], lu.test(h.type || "") && !r.access(h, "globalEval") && i.contains(y, h) && (h.src && "module" !== (h.type || "").toLowerCase() ? i._evalUrl && !h.noModule && i._evalUrl(h.src, {
                    nonce: h.nonce || h.getAttribute("nonce")
                }, y) : br(h.textContent.replace(de, ""), h, y))
        }
        return n
    }

    function bu(n, t, r) {
        for (var u, e = t ? i.filter(t, n) : n, f = 0; null != (u = e[f]); f++) r || 1 !== u.nodeType || i.cleanData(s(u)), u.parentNode && (r && st(u) && di(s(u, "script")), u.parentNode.removeChild(u));
        return n
    }

    function ni(n, t, r) {
        var o, s, h, f, u = n.style;
        return (r = r || ci(n)) && ("" !== (f = r.getPropertyValue(t) || r[t]) || st(n) || (f = i.style(n, t)), !e.pixelBoxStyles() && nr.test(f) && to.test(t) && (o = u.width, s = u.minWidth, h = u.maxWidth, u.minWidth = u.maxWidth = u.width = f, f = r.width, u.width = o, u.minWidth = s, u.maxWidth = h)), void 0 !== f ? f + "" : f
    }

    function du(n, t) {
        return {
            get: function() {
                if (!n()) return (this.get = t).apply(this, arguments);
                delete this.get
            }
        }
    }

    function tr(n) {
        var t = i.cssProps[n] || tf[n];
        return t || (n in nf ? n : tf[n] = function(n) {
            for (var i = n[0].toUpperCase() + n.slice(1), t = gu.length; t--;)
                if ((n = gu[t] + i) in nf) return n
        }(n) || n)
    }

    function ff(n, t, i) {
        var r = kt.exec(t);
        return r ? Math.max(0, r[2] - (i || 0)) + (r[3] || "px") : t
    }

    function ir(n, t, r, u, f, e) {
        var o = "width" === t ? 1 : 0,
            h = 0,
            s = 0;
        if (r === (u ? "border" : "content")) return 0;
        for (; o < 4; o += 2) "margin" === r && (s += i.css(n, r + b[o], !0, f)), u ? ("content" === r && (s -= i.css(n, "padding" + b[o], !0, f)), "margin" !== r && (s -= i.css(n, "border" + b[o] + "Width", !0, f))) : (s += i.css(n, "padding" + b[o], !0, f), "padding" !== r ? s += i.css(n, "border" + b[o] + "Width", !0, f) : h += i.css(n, "border" + b[o] + "Width", !0, f));
        return !u && 0 <= e && (s += Math.max(0, Math.ceil(n["offset" + t[0].toUpperCase() + t.slice(1)] - e - s - h - .5)) || 0), s
    }

    function ef(n, t, r) {
        var f = ci(n),
            o = (!e.boxSizingReliable() || r) && "border-box" === i.css(n, "boxSizing", !1, f),
            s = o,
            u = ni(n, t, f),
            h = "offset" + t[0].toUpperCase() + t.slice(1);
        if (nr.test(u)) {
            if (!r) return u;
            u = "auto"
        }
        return (!e.boxSizingReliable() && o || !e.reliableTrDimensions() && c(n, "tr") || "auto" === u || !parseFloat(u) && "inline" === i.css(n, "display", !1, f)) && n.getClientRects().length && (o = "border-box" === i.css(n, "boxSizing", !1, f), (s = h in n) && (u = n[h])), (u = parseFloat(u) || 0) + ir(n, t, r || (o ? "border" : "content"), s, f, u) + "px"
    }

    function a(n, t, i, r, u) {
        return new a.prototype.init(n, t, i, r, u)
    }

    function rr() {
        li && (!1 === f.hidden && n.requestAnimationFrame ? n.requestAnimationFrame(rr) : n.setTimeout(rr, i.fx.interval), i.fx.tick())
    }

    function cf() {
        return n.setTimeout(function() {
            vt = void 0
        }), vt = Date.now()
    }

    function ai(n, t) {
        var u, r = 0,
            i = {
                height: n
            };
        for (t = t ? 1 : 0; r < 4; r += 2 - t) i["margin" + (u = b[r])] = i["padding" + u] = n;
        return t && (i.opacity = i.width = n), i
    }

    function lf(n, t, i) {
        for (var u, f = (v.tweeners[t] || []).concat(v.tweeners["*"]), r = 0, e = f.length; r < e; r++)
            if (u = f[r].call(i, t, n)) return u
    }

    function v(n, t, r) {
        var o, s, h = 0,
            a = v.prefilters.length,
            e = i.Deferred().always(function() {
                delete l.elem
            }),
            l = function() {
                if (s) return !1;
                for (var o = vt || cf(), t = Math.max(0, f.startTime + f.duration - o), i = 1 - (t / f.duration || 0), r = 0, u = f.tweens.length; r < u; r++) f.tweens[r].run(i);
                return e.notifyWith(n, [f, i, t]), i < 1 && u ? t : (u || e.notifyWith(n, [f, 1, 0]), e.resolveWith(n, [f]), !1)
            },
            f = e.promise({
                elem: n,
                props: i.extend({}, t),
                opts: i.extend(!0, {
                    specialEasing: {},
                    easing: i.easing._default
                }, r),
                originalProperties: t,
                originalOptions: r,
                startTime: vt || cf(),
                duration: r.duration,
                tweens: [],
                createTween: function(t, r) {
                    var u = i.Tween(n, f.opts, t, r, f.opts.specialEasing[t] || f.opts.easing);
                    return f.tweens.push(u), u
                },
                stop: function(t) {
                    var i = 0,
                        r = t ? f.tweens.length : 0;
                    if (s) return this;
                    for (s = !0; i < r; i++) f.tweens[i].run(1);
                    return t ? (e.notifyWith(n, [f, 1, 0]), e.resolveWith(n, [f, t])) : e.rejectWith(n, [f, t]), this
                }
            }),
            c = f.props;
        for (! function(n, t) {
                var r, f, e, u, o;
                for (r in n)
                    if (e = t[f = y(r)], u = n[r], Array.isArray(u) && (e = u[1], u = n[r] = u[0]), r !== f && (n[f] = u, delete n[r]), (o = i.cssHooks[f]) && "expand" in o)
                        for (r in u = o.expand(u), delete n[f], u) r in n || (n[r] = u[r], t[r] = e);
                    else t[f] = e
            }(c, f.opts.specialEasing); h < a; h++)
            if (o = v.prefilters[h].call(f, n, c, f.opts)) return u(o.stop) && (i._queueHooks(f.elem, f.opts.queue).stop = o.stop.bind(o)), o;
        return i.map(c, lf, f), u(f.opts.start) && f.opts.start.call(n, f), f.progress(f.opts.progress).done(f.opts.done, f.opts.complete).fail(f.opts.fail).always(f.opts.always), i.fx.timer(i.extend(l, {
            elem: n,
            anim: f,
            queue: f.opts.queue
        })), f
    }

    function tt(n) {
        return (n.match(l) || []).join(" ")
    }

    function it(n) {
        return n.getAttribute && n.getAttribute("class") || ""
    }

    function ur(n) {
        return Array.isArray(n) ? n : "string" == typeof n && n.match(l) || []
    }

    function sr(n, t, r, u) {
        var f;
        if (Array.isArray(t)) i.each(t, function(t, i) {
            r || uo.test(n) ? u(n, i) : sr(n + "[" + ("object" == typeof i && null != i ? t : "") + "]", i, r, u)
        });
        else if (r || "object" !== ut(t)) u(n, t);
        else
            for (f in t) sr(n + "[" + f + "]", t[f], r, u)
    }

    function gf(n) {
        return function(t, i) {
            "string" != typeof t && (i = t, t = "*");
            var r, f = 0,
                e = t.toLowerCase().match(l) || [];
            if (u(i))
                while (r = e[f++]) "+" === r[0] ? (r = r.slice(1) || "*", (n[r] = n[r] || []).unshift(i)) : (n[r] = n[r] || []).push(i)
        }
    }

    function ne(n, t, r, u) {
        function e(s) {
            var h;
            return f[s] = !0, i.each(n[s] || [], function(n, i) {
                var s = i(t, r, u);
                return "string" != typeof s || o || f[s] ? o ? !(h = s) : void 0 : (t.dataTypes.unshift(s), e(s), !1)
            }), h
        }
        var f = {},
            o = n === hr;
        return e(t.dataTypes[0]) || !f["*"] && e("*")
    }

    function lr(n, t) {
        var r, u, f = i.ajaxSettings.flatOptions || {};
        for (r in t) void 0 !== t[r] && ((f[r] ? n : u || (u = {}))[r] = t[r]);
        return u && i.extend(!0, n, u), n
    }
    var p = [],
        vr = Object.getPrototypeOf,
        k = p.slice,
        yr = p.flat ? function(n) {
            return p.flat.call(n)
        } : function(n) {
            return p.concat.apply([], n)
        },
        yi = p.push,
        ii = p.indexOf,
        ri = {},
        pr = ri.toString,
        ui = ri.hasOwnProperty,
        wr = ui.toString,
        ee = wr.call(Object),
        e = {},
        u = function(n) {
            return "function" == typeof n && "number" != typeof n.nodeType
        },
        rt = function(n) {
            return null != n && n === n.window
        },
        f = n.document,
        oe = {
            type: !0,
            src: !0,
            nonce: !0,
            noModule: !0
        },
        kr = "3.5.1",
        i = function(n, t) {
            return new i.fn.init(n, t)
        },
        d, wi, nu, tu, iu, ru, l, eu, ei, ot, dt, ki, h, au, vt, li, yt, of , sf, hf, af, pt, vf, yf, pf, fr, er, te, wt, ie, ar, vi, re, ue, fe;
    i.fn = i.prototype = {
        jquery: kr,
        constructor: i,
        length: 0,
        toArray: function() {
            return k.call(this)
        },
        get: function(n) {
            return null == n ? k.call(this) : n < 0 ? this[n + this.length] : this[n]
        },
        pushStack: function(n) {
            var t = i.merge(this.constructor(), n);
            return t.prevObject = this, t
        },
        each: function(n) {
            return i.each(this, n)
        },
        map: function(n) {
            return this.pushStack(i.map(this, function(t, i) {
                return n.call(t, i, t)
            }))
        },
        slice: function() {
            return this.pushStack(k.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        even: function() {
            return this.pushStack(i.grep(this, function(n, t) {
                return (t + 1) % 2
            }))
        },
        odd: function() {
            return this.pushStack(i.grep(this, function(n, t) {
                return t % 2
            }))
        },
        eq: function(n) {
            var i = this.length,
                t = +n + (n < 0 ? i : 0);
            return this.pushStack(0 <= t && t < i ? [this[t]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor()
        },
        push: yi,
        sort: p.sort,
        splice: p.splice
    };
    i.extend = i.fn.extend = function() {
        var s, f, e, t, o, c, n = arguments[0] || {},
            r = 1,
            l = arguments.length,
            h = !1;
        for ("boolean" == typeof n && (h = n, n = arguments[r] || {}, r++), "object" == typeof n || u(n) || (n = {}), r === l && (n = this, r--); r < l; r++)
            if (null != (s = arguments[r]))
                for (f in s) t = s[f], "__proto__" !== f && n !== t && (h && t && (i.isPlainObject(t) || (o = Array.isArray(t))) ? (e = n[f], c = o && !Array.isArray(e) ? [] : o || i.isPlainObject(e) ? e : {}, o = !1, n[f] = i.extend(h, c, t)) : void 0 !== t && (n[f] = t));
        return n
    };
    i.extend({
        expando: "jQuery" + (kr + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(n) {
            throw new Error(n);
        },
        noop: function() {},
        isPlainObject: function(n) {
            var t, i;
            return !(!n || "[object Object]" !== pr.call(n)) && (!(t = vr(n)) || "function" == typeof(i = ui.call(t, "constructor") && t.constructor) && wr.call(i) === ee)
        },
        isEmptyObject: function(n) {
            for (var t in n) return !1;
            return !0
        },
        globalEval: function(n, t, i) {
            br(n, {
                nonce: t && t.nonce
            }, i)
        },
        each: function(n, t) {
            var r, i = 0;
            if (pi(n)) {
                for (r = n.length; i < r; i++)
                    if (!1 === t.call(n[i], i, n[i])) break
            } else
                for (i in n)
                    if (!1 === t.call(n[i], i, n[i])) break;
            return n
        },
        makeArray: function(n, t) {
            var r = t || [];
            return null != n && (pi(Object(n)) ? i.merge(r, "string" == typeof n ? [n] : n) : yi.call(r, n)), r
        },
        inArray: function(n, t, i) {
            return null == t ? -1 : ii.call(t, n, i)
        },
        merge: function(n, t) {
            for (var u = +t.length, i = 0, r = n.length; i < u; i++) n[r++] = t[i];
            return n.length = r, n
        },
        grep: function(n, t, i) {
            for (var u = [], r = 0, f = n.length, e = !i; r < f; r++) !t(n[r], r) !== e && u.push(n[r]);
            return u
        },
        map: function(n, t, i) {
            var e, u, r = 0,
                f = [];
            if (pi(n))
                for (e = n.length; r < e; r++) null != (u = t(n[r], r, i)) && f.push(u);
            else
                for (r in n) null != (u = t(n[r], r, i)) && f.push(u);
            return yr(f)
        },
        guid: 1,
        support: e
    });
    "function" == typeof Symbol && (i.fn[Symbol.iterator] = p[Symbol.iterator]);
    i.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(n, t) {
        ri["[object " + t + "]"] = t.toLowerCase()
    });
    d = function(n) {
        function u(n, t, r, u) {
            var s, y, c, l, p, w, d, v = t && t.ownerDocument,
                a = t ? t.nodeType : 9;
            if (r = r || [], "string" != typeof n || !n || 1 !== a && 9 !== a && 11 !== a) return r;
            if (!u && (b(t), t = t || i, h)) {
                if (11 !== a && (p = ar.exec(n)))
                    if (s = p[1]) {
                        if (9 === a) {
                            if (!(c = t.getElementById(s))) return r;
                            if (c.id === s) return r.push(c), r
                        } else if (v && (c = v.getElementById(s)) && et(t, c) && c.id === s) return r.push(c), r
                    } else {
                        if (p[2]) return k.apply(r, t.getElementsByTagName(n)), r;
                        if ((s = p[3]) && f.getElementsByClassName && t.getElementsByClassName) return k.apply(r, t.getElementsByClassName(s)), r
                    } if (f.qsa && !lt[n + " "] && (!o || !o.test(n)) && (1 !== a || "object" !== t.nodeName.toLowerCase())) {
                    if (d = n, v = t, 1 === a && (er.test(n) || yi.test(n))) {
                        for ((v = ti.test(n) && ri(t.parentNode) || t) === t && f.scope || ((l = t.getAttribute("id")) ? l = l.replace(pi, wi) : t.setAttribute("id", l = e)), y = (w = ft(n)).length; y--;) w[y] = (l ? "#" + l : ":scope") + " " + pt(w[y]);
                        d = w.join(",")
                    }
                    try {
                        return k.apply(r, v.querySelectorAll(d)), r
                    } catch (t) {
                        lt(n, !0)
                    } finally {
                        l === e && t.removeAttribute("id")
                    }
                }
            }
            return si(n.replace(at, "$1"), t, r, u)
        }

        function yt() {
            var n = [];
            return function i(r, u) {
                return n.push(r + " ") > t.cacheLength && delete i[n.shift()], i[r + " "] = u
            }
        }

        function l(n) {
            return n[e] = !0, n
        }

        function a(n) {
            var t = i.createElement("fieldset");
            try {
                return !!n(t)
            } catch (n) {
                return !1
            } finally {
                t.parentNode && t.parentNode.removeChild(t);
                t = null
            }
        }

        function ii(n, i) {
            for (var r = n.split("|"), u = r.length; u--;) t.attrHandle[r[u]] = i
        }

        function ki(n, t) {
            var i = t && n,
                r = i && 1 === n.nodeType && 1 === t.nodeType && n.sourceIndex - t.sourceIndex;
            if (r) return r;
            if (i)
                while (i = i.nextSibling)
                    if (i === t) return -1;
            return n ? 1 : -1
        }

        function yr(n) {
            return function(t) {
                return "input" === t.nodeName.toLowerCase() && t.type === n
            }
        }

        function pr(n) {
            return function(t) {
                var i = t.nodeName.toLowerCase();
                return ("input" === i || "button" === i) && t.type === n
            }
        }

        function di(n) {
            return function(t) {
                return "form" in t ? t.parentNode && !1 === t.disabled ? "label" in t ? "label" in t.parentNode ? t.parentNode.disabled === n : t.disabled === n : t.isDisabled === n || t.isDisabled !== !n && vr(t) === n : t.disabled === n : "label" in t && t.disabled === n
            }
        }

        function it(n) {
            return l(function(t) {
                return t = +t, l(function(i, r) {
                    for (var u, f = n([], i.length, t), e = f.length; e--;) i[u = f[e]] && (i[u] = !(r[u] = i[u]))
                })
            })
        }

        function ri(n) {
            return n && "undefined" != typeof n.getElementsByTagName && n
        }

        function gi() {}

        function pt(n) {
            for (var t = 0, r = n.length, i = ""; t < r; t++) i += n[t].value;
            return i
        }

        function wt(n, t, i) {
            var r = t.dir,
                u = t.next,
                f = u || r,
                o = i && "parentNode" === f,
                s = nr++;
            return t.first ? function(t, i, u) {
                while (t = t[r])
                    if (1 === t.nodeType || o) return n(t, i, u);
                return !1
            } : function(t, i, h) {
                var c, l, a, y = [v, s];
                if (h) {
                    while (t = t[r])
                        if ((1 === t.nodeType || o) && n(t, i, h)) return !0
                } else
                    while (t = t[r])
                        if (1 === t.nodeType || o)
                            if (l = (a = t[e] || (t[e] = {}))[t.uniqueID] || (a[t.uniqueID] = {}), u && u === t.nodeName.toLowerCase()) t = t[r] || t;
                            else {
                                if ((c = l[f]) && c[0] === v && c[1] === s) return y[2] = c[2];
                                if ((l[f] = y)[2] = n(t, i, h)) return !0
                            } return !1
            }
        }

        function ui(n) {
            return 1 < n.length ? function(t, i, r) {
                for (var u = n.length; u--;)
                    if (!n[u](t, i, r)) return !1;
                return !0
            } : n[0]
        }

        function bt(n, t, i, r, u) {
            for (var e, o = [], f = 0, s = n.length, h = null != t; f < s; f++)(e = n[f]) && (i && !i(e, r, u) || (o.push(e), h && t.push(f)));
            return o
        }

        function fi(n, t, i, r, f, o) {
            return r && !r[e] && (r = fi(r)), f && !f[e] && (f = fi(f, o)), l(function(e, o, s, h) {
                var a, l, v, w = [],
                    p = [],
                    b = o.length,
                    d = e || function(n, t, i) {
                        for (var r = 0, f = t.length; r < f; r++) u(n, t[r], i);
                        return i
                    }(t || "*", s.nodeType ? [s] : s, []),
                    y = !n || !e && t ? d : bt(d, w, n, s, h),
                    c = i ? f || (e ? n : b || r) ? [] : o : y;
                if (i && i(y, c, s, h), r)
                    for (a = bt(c, p), r(a, [], s, h), l = a.length; l--;)(v = a[l]) && (c[p[l]] = !(y[p[l]] = v));
                if (e) {
                    if (f || n) {
                        if (f) {
                            for (a = [], l = c.length; l--;)(v = c[l]) && a.push(y[l] = v);
                            f(null, c = [], a, h)
                        }
                        for (l = c.length; l--;)(v = c[l]) && -1 < (a = f ? nt(e, v) : w[l]) && (e[a] = !(o[a] = v))
                    }
                } else c = bt(c === o ? c.splice(b, c.length) : c), f ? f(null, o, c, h) : k.apply(o, c)
            })
        }

        function ei(n) {
            for (var o, u, r, s = n.length, h = t.relative[n[0].type], c = h || t.relative[" "], i = h ? 1 : 0, l = wt(function(n) {
                    return n === o
                }, c, !0), a = wt(function(n) {
                    return -1 < nt(o, n)
                }, c, !0), f = [function(n, t, i) {
                    var r = !h && (i || t !== ht) || ((o = t).nodeType ? l(n, t, i) : a(n, t, i));
                    return o = null, r
                }]; i < s; i++)
                if (u = t.relative[n[i].type]) f = [wt(ui(f), u)];
                else {
                    if ((u = t.filter[n[i].type].apply(null, n[i].matches))[e]) {
                        for (r = ++i; r < s; r++)
                            if (t.relative[n[r].type]) break;
                        return fi(1 < i && ui(f), 1 < i && pt(n.slice(0, i - 1).concat({
                            value: " " === n[i - 2].type ? "*" : ""
                        })).replace(at, "$1"), u, i < r && ei(n.slice(i, r)), r < s && ei(n = n.slice(r)), r < s && pt(n))
                    }
                    f.push(u)
                } return ui(f)
        }
        var rt, f, t, st, oi, ft, kt, si, ht, w, ut, b, i, s, h, o, d, ct, et, e = "sizzle" + 1 * new Date,
            c = n.document,
            v = 0,
            nr = 0,
            hi = yt(),
            ci = yt(),
            li = yt(),
            lt = yt(),
            dt = function(n, t) {
                return n === t && (ut = !0), 0
            },
            tr = {}.hasOwnProperty,
            g = [],
            ir = g.pop,
            rr = g.push,
            k = g.push,
            ai = g.slice,
            nt = function(n, t) {
                for (var i = 0, r = n.length; i < r; i++)
                    if (n[i] === t) return i;
                return -1
            },
            gt = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
            r = "[\\x20\\t\\r\\n\\f]",
            tt = "(?:\\\\[\\da-fA-F]{1,6}" + r + "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",
            vi = "\\[" + r + "*(" + tt + ")(?:" + r + "*([*^$|!~]?=)" + r + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + tt + "))|)" + r + "*\\]",
            ni = ":(" + tt + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + vi + ")*)|.*)\\)|)",
            ur = new RegExp(r + "+", "g"),
            at = new RegExp("^" + r + "+|((?:^|[^\\\\])(?:\\\\.)*)" + r + "+$", "g"),
            fr = new RegExp("^" + r + "*," + r + "*"),
            yi = new RegExp("^" + r + "*([>+~]|" + r + ")" + r + "*"),
            er = new RegExp(r + "|>"),
            or = new RegExp(ni),
            sr = new RegExp("^" + tt + "$"),
            vt = {
                ID: new RegExp("^#(" + tt + ")"),
                CLASS: new RegExp("^\\.(" + tt + ")"),
                TAG: new RegExp("^(" + tt + "|[*])"),
                ATTR: new RegExp("^" + vi),
                PSEUDO: new RegExp("^" + ni),
                CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + r + "*(even|odd|(([+-]|)(\\d*)n|)" + r + "*(?:([+-]|)" + r + "*(\\d+)|))" + r + "*\\)|)", "i"),
                bool: new RegExp("^(?:" + gt + ")$", "i"),
                needsContext: new RegExp("^" + r + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + r + "*((?:-\\d)?\\d*)" + r + "*\\)|)(?=[^-]|$)", "i")
            },
            hr = /HTML$/i,
            cr = /^(?:input|select|textarea|button)$/i,
            lr = /^h\d$/i,
            ot = /^[^{]+\{\s*\[native \w/,
            ar = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
            ti = /[+~]/,
            y = new RegExp("\\\\[\\da-fA-F]{1,6}" + r + "?|\\\\([^\\r\\n\\f])", "g"),
            p = function(n, t) {
                var i = "0x" + n.slice(1) - 65536;
                return t || (i < 0 ? String.fromCharCode(i + 65536) : String.fromCharCode(i >> 10 | 55296, 1023 & i | 56320))
            },
            pi = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
            wi = function(n, t) {
                return t ? "\0" === n ? "ï¿½" : n.slice(0, -1) + "\\" + n.charCodeAt(n.length - 1).toString(16) + " " : "\\" + n
            },
            bi = function() {
                b()
            },
            vr = wt(function(n) {
                return !0 === n.disabled && "fieldset" === n.nodeName.toLowerCase()
            }, {
                dir: "parentNode",
                next: "legend"
            });
        try {
            k.apply(g = ai.call(c.childNodes), c.childNodes);
            g[c.childNodes.length].nodeType
        } catch (rt) {
            k = {
                apply: g.length ? function(n, t) {
                    rr.apply(n, ai.call(t))
                } : function(n, t) {
                    for (var i = n.length, r = 0; n[i++] = t[r++];);
                    n.length = i - 1
                }
            }
        }
        for (rt in f = u.support = {}, oi = u.isXML = function(n) {
                var i = n.namespaceURI,
                    t = (n.ownerDocument || n).documentElement;
                return !hr.test(i || t && t.nodeName || "HTML")
            }, b = u.setDocument = function(n) {
                var v, u, l = n ? n.ownerDocument || n : c;
                return l != i && 9 === l.nodeType && l.documentElement && (s = (i = l).documentElement, h = !oi(i), c != i && (u = i.defaultView) && u.top !== u && (u.addEventListener ? u.addEventListener("unload", bi, !1) : u.attachEvent && u.attachEvent("onunload", bi)), f.scope = a(function(n) {
                    return s.appendChild(n).appendChild(i.createElement("div")), "undefined" != typeof n.querySelectorAll && !n.querySelectorAll(":scope fieldset div").length
                }), f.attributes = a(function(n) {
                    return n.className = "i", !n.getAttribute("className")
                }), f.getElementsByTagName = a(function(n) {
                    return n.appendChild(i.createComment("")), !n.getElementsByTagName("*").length
                }), f.getElementsByClassName = ot.test(i.getElementsByClassName), f.getById = a(function(n) {
                    return s.appendChild(n).id = e, !i.getElementsByName || !i.getElementsByName(e).length
                }), f.getById ? (t.filter.ID = function(n) {
                    var t = n.replace(y, p);
                    return function(n) {
                        return n.getAttribute("id") === t
                    }
                }, t.find.ID = function(n, t) {
                    if ("undefined" != typeof t.getElementById && h) {
                        var i = t.getElementById(n);
                        return i ? [i] : []
                    }
                }) : (t.filter.ID = function(n) {
                    var t = n.replace(y, p);
                    return function(n) {
                        var i = "undefined" != typeof n.getAttributeNode && n.getAttributeNode("id");
                        return i && i.value === t
                    }
                }, t.find.ID = function(n, t) {
                    if ("undefined" != typeof t.getElementById && h) {
                        var r, u, f, i = t.getElementById(n);
                        if (i) {
                            if ((r = i.getAttributeNode("id")) && r.value === n) return [i];
                            for (f = t.getElementsByName(n), u = 0; i = f[u++];)
                                if ((r = i.getAttributeNode("id")) && r.value === n) return [i]
                        }
                        return []
                    }
                }), t.find.TAG = f.getElementsByTagName ? function(n, t) {
                    return "undefined" != typeof t.getElementsByTagName ? t.getElementsByTagName(n) : f.qsa ? t.querySelectorAll(n) : void 0
                } : function(n, t) {
                    var i, r = [],
                        f = 0,
                        u = t.getElementsByTagName(n);
                    if ("*" === n) {
                        while (i = u[f++]) 1 === i.nodeType && r.push(i);
                        return r
                    }
                    return u
                }, t.find.CLASS = f.getElementsByClassName && function(n, t) {
                    if ("undefined" != typeof t.getElementsByClassName && h) return t.getElementsByClassName(n)
                }, d = [], o = [], (f.qsa = ot.test(i.querySelectorAll)) && (a(function(n) {
                    var t;
                    s.appendChild(n).innerHTML = "<a id='" + e + "'><\/a><select id='" + e + "-\r\\' msallowcapture=''><option selected=''><\/option><\/select>";
                    n.querySelectorAll("[msallowcapture^='']").length && o.push("[*^$]=" + r + "*(?:''|\"\")");
                    n.querySelectorAll("[selected]").length || o.push("\\[" + r + "*(?:value|" + gt + ")");
                    n.querySelectorAll("[id~=" + e + "-]").length || o.push("~=");
                    (t = i.createElement("input")).setAttribute("name", "");
                    n.appendChild(t);
                    n.querySelectorAll("[name='']").length || o.push("\\[" + r + "*name" + r + "*=" + r + "*(?:''|\"\")");
                    n.querySelectorAll(":checked").length || o.push(":checked");
                    n.querySelectorAll("a#" + e + "+*").length || o.push(".#.+[+~]");
                    n.querySelectorAll("\\\f");
                    o.push("[\\r\\n\\f]")
                }), a(function(n) {
                    n.innerHTML = "<a href='' disabled='disabled'><\/a><select disabled='disabled'><option/><\/select>";
                    var t = i.createElement("input");
                    t.setAttribute("type", "hidden");
                    n.appendChild(t).setAttribute("name", "D");
                    n.querySelectorAll("[name=d]").length && o.push("name" + r + "*[*^$|!~]?=");
                    2 !== n.querySelectorAll(":enabled").length && o.push(":enabled", ":disabled");
                    s.appendChild(n).disabled = !0;
                    2 !== n.querySelectorAll(":disabled").length && o.push(":enabled", ":disabled");
                    n.querySelectorAll("*,:x");
                    o.push(",.*:")
                })), (f.matchesSelector = ot.test(ct = s.matches || s.webkitMatchesSelector || s.mozMatchesSelector || s.oMatchesSelector || s.msMatchesSelector)) && a(function(n) {
                    f.disconnectedMatch = ct.call(n, "*");
                    ct.call(n, "[s!='']:x");
                    d.push("!=", ni)
                }), o = o.length && new RegExp(o.join("|")), d = d.length && new RegExp(d.join("|")), v = ot.test(s.compareDocumentPosition), et = v || ot.test(s.contains) ? function(n, t) {
                    var r = 9 === n.nodeType ? n.documentElement : n,
                        i = t && t.parentNode;
                    return n === i || !(!i || 1 !== i.nodeType || !(r.contains ? r.contains(i) : n.compareDocumentPosition && 16 & n.compareDocumentPosition(i)))
                } : function(n, t) {
                    if (t)
                        while (t = t.parentNode)
                            if (t === n) return !0;
                    return !1
                }, dt = v ? function(n, t) {
                    if (n === t) return ut = !0, 0;
                    var r = !n.compareDocumentPosition - !t.compareDocumentPosition;
                    return r || (1 & (r = (n.ownerDocument || n) == (t.ownerDocument || t) ? n.compareDocumentPosition(t) : 1) || !f.sortDetached && t.compareDocumentPosition(n) === r ? n == i || n.ownerDocument == c && et(c, n) ? -1 : t == i || t.ownerDocument == c && et(c, t) ? 1 : w ? nt(w, n) - nt(w, t) : 0 : 4 & r ? -1 : 1)
                } : function(n, t) {
                    if (n === t) return ut = !0, 0;
                    var r, u = 0,
                        o = n.parentNode,
                        s = t.parentNode,
                        f = [n],
                        e = [t];
                    if (!o || !s) return n == i ? -1 : t == i ? 1 : o ? -1 : s ? 1 : w ? nt(w, n) - nt(w, t) : 0;
                    if (o === s) return ki(n, t);
                    for (r = n; r = r.parentNode;) f.unshift(r);
                    for (r = t; r = r.parentNode;) e.unshift(r);
                    while (f[u] === e[u]) u++;
                    return u ? ki(f[u], e[u]) : f[u] == c ? -1 : e[u] == c ? 1 : 0
                }), i
            }, u.matches = function(n, t) {
                return u(n, null, null, t)
            }, u.matchesSelector = function(n, t) {
                if (b(n), f.matchesSelector && h && !lt[t + " "] && (!d || !d.test(t)) && (!o || !o.test(t))) try {
                    var r = ct.call(n, t);
                    if (r || f.disconnectedMatch || n.document && 11 !== n.document.nodeType) return r
                } catch (n) {
                    lt(t, !0)
                }
                return 0 < u(t, i, null, [n]).length
            }, u.contains = function(n, t) {
                return (n.ownerDocument || n) != i && b(n), et(n, t)
            }, u.attr = function(n, r) {
                (n.ownerDocument || n) != i && b(n);
                var e = t.attrHandle[r.toLowerCase()],
                    u = e && tr.call(t.attrHandle, r.toLowerCase()) ? e(n, r, !h) : void 0;
                return void 0 !== u ? u : f.attributes || !h ? n.getAttribute(r) : (u = n.getAttributeNode(r)) && u.specified ? u.value : null
            }, u.escape = function(n) {
                return (n + "").replace(pi, wi)
            }, u.error = function(n) {
                throw new Error("Syntax error, unrecognized expression: " + n);
            }, u.uniqueSort = function(n) {
                var r, u = [],
                    t = 0,
                    i = 0;
                if (ut = !f.detectDuplicates, w = !f.sortStable && n.slice(0), n.sort(dt), ut) {
                    while (r = n[i++]) r === n[i] && (t = u.push(i));
                    while (t--) n.splice(u[t], 1)
                }
                return w = null, n
            }, st = u.getText = function(n) {
                var r, i = "",
                    u = 0,
                    t = n.nodeType;
                if (t) {
                    if (1 === t || 9 === t || 11 === t) {
                        if ("string" == typeof n.textContent) return n.textContent;
                        for (n = n.firstChild; n; n = n.nextSibling) i += st(n)
                    } else if (3 === t || 4 === t) return n.nodeValue
                } else
                    while (r = n[u++]) i += st(r);
                return i
            }, (t = u.selectors = {
                cacheLength: 50,
                createPseudo: l,
                match: vt,
                attrHandle: {},
                find: {},
                relative: {
                    ">": {
                        dir: "parentNode",
                        first: !0
                    },
                    " ": {
                        dir: "parentNode"
                    },
                    "+": {
                        dir: "previousSibling",
                        first: !0
                    },
                    "~": {
                        dir: "previousSibling"
                    }
                },
                preFilter: {
                    ATTR: function(n) {
                        return n[1] = n[1].replace(y, p), n[3] = (n[3] || n[4] || n[5] || "").replace(y, p), "~=" === n[2] && (n[3] = " " + n[3] + " "), n.slice(0, 4)
                    },
                    CHILD: function(n) {
                        return n[1] = n[1].toLowerCase(), "nth" === n[1].slice(0, 3) ? (n[3] || u.error(n[0]), n[4] = +(n[4] ? n[5] + (n[6] || 1) : 2 * ("even" === n[3] || "odd" === n[3])), n[5] = +(n[7] + n[8] || "odd" === n[3])) : n[3] && u.error(n[0]), n
                    },
                    PSEUDO: function(n) {
                        var i, t = !n[6] && n[2];
                        return vt.CHILD.test(n[0]) ? null : (n[3] ? n[2] = n[4] || n[5] || "" : t && or.test(t) && (i = ft(t, !0)) && (i = t.indexOf(")", t.length - i) - t.length) && (n[0] = n[0].slice(0, i), n[2] = t.slice(0, i)), n.slice(0, 3))
                    }
                },
                filter: {
                    TAG: function(n) {
                        var t = n.replace(y, p).toLowerCase();
                        return "*" === n ? function() {
                            return !0
                        } : function(n) {
                            return n.nodeName && n.nodeName.toLowerCase() === t
                        }
                    },
                    CLASS: function(n) {
                        var t = hi[n + " "];
                        return t || (t = new RegExp("(^|" + r + ")" + n + "(" + r + "|$)")) && hi(n, function(n) {
                            return t.test("string" == typeof n.className && n.className || "undefined" != typeof n.getAttribute && n.getAttribute("class") || "")
                        })
                    },
                    ATTR: function(n, t, i) {
                        return function(r) {
                            var f = u.attr(r, n);
                            return null == f ? "!=" === t : !t || (f += "", "=" === t ? f === i : "!=" === t ? f !== i : "^=" === t ? i && 0 === f.indexOf(i) : "*=" === t ? i && -1 < f.indexOf(i) : "$=" === t ? i && f.slice(-i.length) === i : "~=" === t ? -1 < (" " + f.replace(ur, " ") + " ").indexOf(i) : "|=" === t && (f === i || f.slice(0, i.length + 1) === i + "-"))
                        }
                    },
                    CHILD: function(n, t, i, r, u) {
                        var s = "nth" !== n.slice(0, 3),
                            o = "last" !== n.slice(-4),
                            f = "of-type" === t;
                        return 1 === r && 0 === u ? function(n) {
                            return !!n.parentNode
                        } : function(t, i, h) {
                            var p, d, y, c, a, w, b = s !== o ? "nextSibling" : "previousSibling",
                                k = t.parentNode,
                                nt = f && t.nodeName.toLowerCase(),
                                g = !h && !f,
                                l = !1;
                            if (k) {
                                if (s) {
                                    while (b) {
                                        for (c = t; c = c[b];)
                                            if (f ? c.nodeName.toLowerCase() === nt : 1 === c.nodeType) return !1;
                                        w = b = "only" === n && !w && "nextSibling"
                                    }
                                    return !0
                                }
                                if (w = [o ? k.firstChild : k.lastChild], o && g) {
                                    for (l = (a = (p = (d = (y = (c = k)[e] || (c[e] = {}))[c.uniqueID] || (y[c.uniqueID] = {}))[n] || [])[0] === v && p[1]) && p[2], c = a && k.childNodes[a]; c = ++a && c && c[b] || (l = a = 0) || w.pop();)
                                        if (1 === c.nodeType && ++l && c === t) {
                                            d[n] = [v, a, l];
                                            break
                                        }
                                } else if (g && (l = a = (p = (d = (y = (c = t)[e] || (c[e] = {}))[c.uniqueID] || (y[c.uniqueID] = {}))[n] || [])[0] === v && p[1]), !1 === l)
                                    while (c = ++a && c && c[b] || (l = a = 0) || w.pop())
                                        if ((f ? c.nodeName.toLowerCase() === nt : 1 === c.nodeType) && ++l && (g && ((d = (y = c[e] || (c[e] = {}))[c.uniqueID] || (y[c.uniqueID] = {}))[n] = [v, l]), c === t)) break;
                                return (l -= u) === r || l % r == 0 && 0 <= l / r
                            }
                        }
                    },
                    PSEUDO: function(n, i) {
                        var f, r = t.pseudos[n] || t.setFilters[n.toLowerCase()] || u.error("unsupported pseudo: " + n);
                        return r[e] ? r(i) : 1 < r.length ? (f = [n, n, "", i], t.setFilters.hasOwnProperty(n.toLowerCase()) ? l(function(n, t) {
                            for (var e, u = r(n, i), f = u.length; f--;) n[e = nt(n, u[f])] = !(t[e] = u[f])
                        }) : function(n) {
                            return r(n, 0, f)
                        }) : r
                    }
                },
                pseudos: {
                    not: l(function(n) {
                        var t = [],
                            r = [],
                            i = kt(n.replace(at, "$1"));
                        return i[e] ? l(function(n, t, r, u) {
                            for (var e, o = i(n, null, u, []), f = n.length; f--;)(e = o[f]) && (n[f] = !(t[f] = e))
                        }) : function(n, u, f) {
                            return t[0] = n, i(t, null, f, r), t[0] = null, !r.pop()
                        }
                    }),
                    has: l(function(n) {
                        return function(t) {
                            return 0 < u(n, t).length
                        }
                    }),
                    contains: l(function(n) {
                        return n = n.replace(y, p),
                            function(t) {
                                return -1 < (t.textContent || st(t)).indexOf(n)
                            }
                    }),
                    lang: l(function(n) {
                        return sr.test(n || "") || u.error("unsupported lang: " + n), n = n.replace(y, p).toLowerCase(),
                            function(t) {
                                var i;
                                do
                                    if (i = h ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return (i = i.toLowerCase()) === n || 0 === i.indexOf(n + "-"); while ((t = t.parentNode) && 1 === t.nodeType);
                                return !1
                            }
                    }),
                    target: function(t) {
                        var i = n.location && n.location.hash;
                        return i && i.slice(1) === t.id
                    },
                    root: function(n) {
                        return n === s
                    },
                    focus: function(n) {
                        return n === i.activeElement && (!i.hasFocus || i.hasFocus()) && !!(n.type || n.href || ~n.tabIndex)
                    },
                    enabled: di(!1),
                    disabled: di(!0),
                    checked: function(n) {
                        var t = n.nodeName.toLowerCase();
                        return "input" === t && !!n.checked || "option" === t && !!n.selected
                    },
                    selected: function(n) {
                        return n.parentNode && n.parentNode.selectedIndex, !0 === n.selected
                    },
                    empty: function(n) {
                        for (n = n.firstChild; n; n = n.nextSibling)
                            if (n.nodeType < 6) return !1;
                        return !0
                    },
                    parent: function(n) {
                        return !t.pseudos.empty(n)
                    },
                    header: function(n) {
                        return lr.test(n.nodeName)
                    },
                    input: function(n) {
                        return cr.test(n.nodeName)
                    },
                    button: function(n) {
                        var t = n.nodeName.toLowerCase();
                        return "input" === t && "button" === n.type || "button" === t
                    },
                    text: function(n) {
                        var t;
                        return "input" === n.nodeName.toLowerCase() && "text" === n.type && (null == (t = n.getAttribute("type")) || "text" === t.toLowerCase())
                    },
                    first: it(function() {
                        return [0]
                    }),
                    last: it(function(n, t) {
                        return [t - 1]
                    }),
                    eq: it(function(n, t, i) {
                        return [i < 0 ? i + t : i]
                    }),
                    even: it(function(n, t) {
                        for (var i = 0; i < t; i += 2) n.push(i);
                        return n
                    }),
                    odd: it(function(n, t) {
                        for (var i = 1; i < t; i += 2) n.push(i);
                        return n
                    }),
                    lt: it(function(n, t, i) {
                        for (var r = i < 0 ? i + t : t < i ? t : i; 0 <= --r;) n.push(r);
                        return n
                    }),
                    gt: it(function(n, t, i) {
                        for (var r = i < 0 ? i + t : i; ++r < t;) n.push(r);
                        return n
                    })
                }
            }).pseudos.nth = t.pseudos.eq, {
                radio: !0,
                checkbox: !0,
                file: !0,
                password: !0,
                image: !0
            }) t.pseudos[rt] = yr(rt);
        for (rt in {
                submit: !0,
                reset: !0
            }) t.pseudos[rt] = pr(rt);
        return gi.prototype = t.filters = t.pseudos, t.setFilters = new gi, ft = u.tokenize = function(n, i) {
            var e, f, s, o, r, h, c, l = ci[n + " "];
            if (l) return i ? 0 : l.slice(0);
            for (r = n, h = [], c = t.preFilter; r;) {
                for (o in e && !(f = fr.exec(r)) || (f && (r = r.slice(f[0].length) || r), h.push(s = [])), e = !1, (f = yi.exec(r)) && (e = f.shift(), s.push({
                        value: e,
                        type: f[0].replace(at, " ")
                    }), r = r.slice(e.length)), t.filter)(f = vt[o].exec(r)) && (!c[o] || (f = c[o](f))) && (e = f.shift(), s.push({
                    value: e,
                    type: o,
                    matches: f
                }), r = r.slice(e.length));
                if (!e) break
            }
            return i ? r.length : r ? u.error(n) : ci(n, h).slice(0)
        }, kt = u.compile = function(n, r) {
            var s, c, a, o, y, p, w = [],
                d = [],
                f = li[n + " "];
            if (!f) {
                for (r || (r = ft(n)), s = r.length; s--;)(f = ei(r[s]))[e] ? w.push(f) : d.push(f);
                (f = li(n, (c = d, o = 0 < (a = w).length, y = 0 < c.length, p = function(n, r, f, e, s) {
                    var l, nt, d, g = 0,
                        p = "0",
                        tt = n && [],
                        w = [],
                        it = ht,
                        rt = n || y && t.find.TAG("*", s),
                        ut = v += null == it ? 1 : Math.random() || .1,
                        ft = rt.length;
                    for (s && (ht = r == i || r || s); p !== ft && null != (l = rt[p]); p++) {
                        if (y && l) {
                            for (nt = 0, r || l.ownerDocument == i || (b(l), f = !h); d = c[nt++];)
                                if (d(l, r || i, f)) {
                                    e.push(l);
                                    break
                                } s && (v = ut)
                        }
                        o && ((l = !d && l) && g--, n && tt.push(l))
                    }
                    if (g += p, o && p !== g) {
                        for (nt = 0; d = a[nt++];) d(tt, w, r, f);
                        if (n) {
                            if (0 < g)
                                while (p--) tt[p] || w[p] || (w[p] = ir.call(e));
                            w = bt(w)
                        }
                        k.apply(e, w);
                        s && !n && 0 < w.length && 1 < g + a.length && u.uniqueSort(e)
                    }
                    return s && (v = ut, ht = it), tt
                }, o ? l(p) : p))).selector = n
            }
            return f
        }, si = u.select = function(n, i, r, u) {
            var o, f, e, l, a, c = "function" == typeof n && n,
                s = !u && ft(n = c.selector || n);
            if (r = r || [], 1 === s.length) {
                if (2 < (f = s[0] = s[0].slice(0)).length && "ID" === (e = f[0]).type && 9 === i.nodeType && h && t.relative[f[1].type]) {
                    if (!(i = (t.find.ID(e.matches[0].replace(y, p), i) || [])[0])) return r;
                    c && (i = i.parentNode);
                    n = n.slice(f.shift().value.length)
                }
                for (o = vt.needsContext.test(n) ? 0 : f.length; o--;) {
                    if (e = f[o], t.relative[l = e.type]) break;
                    if ((a = t.find[l]) && (u = a(e.matches[0].replace(y, p), ti.test(f[0].type) && ri(i.parentNode) || i))) {
                        if (f.splice(o, 1), !(n = u.length && pt(f))) return k.apply(r, u), r;
                        break
                    }
                }
            }
            return (c || kt(n, s))(u, i, !h, r, !i || ti.test(n) && ri(i.parentNode) || i), r
        }, f.sortStable = e.split("").sort(dt).join("") === e, f.detectDuplicates = !!ut, b(), f.sortDetached = a(function(n) {
            return 1 & n.compareDocumentPosition(i.createElement("fieldset"))
        }), a(function(n) {
            return n.innerHTML = "<a href='#'><\/a>", "#" === n.firstChild.getAttribute("href")
        }) || ii("type|href|height|width", function(n, t, i) {
            if (!i) return n.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
        }), f.attributes && a(function(n) {
            return n.innerHTML = "<input/>", n.firstChild.setAttribute("value", ""), "" === n.firstChild.getAttribute("value")
        }) || ii("value", function(n, t, i) {
            if (!i && "input" === n.nodeName.toLowerCase()) return n.defaultValue
        }), a(function(n) {
            return null == n.getAttribute("disabled")
        }) || ii(gt, function(n, t, i) {
            var r;
            if (!i) return !0 === n[t] ? t.toLowerCase() : (r = n.getAttributeNode(t)) && r.specified ? r.value : null
        }), u
    }(n);
    i.find = d;
    i.expr = d.selectors;
    i.expr[":"] = i.expr.pseudos;
    i.uniqueSort = i.unique = d.uniqueSort;
    i.text = d.getText;
    i.isXMLDoc = d.isXML;
    i.contains = d.contains;
    i.escapeSelector = d.escape;
    var ft = function(n, t, r) {
            for (var u = [], f = void 0 !== r;
                (n = n[t]) && 9 !== n.nodeType;)
                if (1 === n.nodeType) {
                    if (f && i(n).is(r)) break;
                    u.push(n)
                } return u
        },
        dr = function(n, t) {
            for (var i = []; n; n = n.nextSibling) 1 === n.nodeType && n !== t && i.push(n);
            return i
        },
        gr = i.expr.match.needsContext;
    wi = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
    i.filter = function(n, t, r) {
        var u = t[0];
        return r && (n = ":not(" + n + ")"), 1 === t.length && 1 === u.nodeType ? i.find.matchesSelector(u, n) ? [u] : [] : i.find.matches(n, i.grep(t, function(n) {
            return 1 === n.nodeType
        }))
    };
    i.fn.extend({
        find: function(n) {
            var t, r, u = this.length,
                f = this;
            if ("string" != typeof n) return this.pushStack(i(n).filter(function() {
                for (t = 0; t < u; t++)
                    if (i.contains(f[t], this)) return !0
            }));
            for (r = this.pushStack([]), t = 0; t < u; t++) i.find(n, f[t], r);
            return 1 < u ? i.uniqueSort(r) : r
        },
        filter: function(n) {
            return this.pushStack(bi(this, n || [], !1))
        },
        not: function(n) {
            return this.pushStack(bi(this, n || [], !0))
        },
        is: function(n) {
            return !!bi(this, "string" == typeof n && gr.test(n) ? i(n) : n || [], !1).length
        }
    });
    tu = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
    (i.fn.init = function(n, t, r) {
        var e, o;
        if (!n) return this;
        if (r = r || nu, "string" == typeof n) {
            if (!(e = "<" === n[0] && ">" === n[n.length - 1] && 3 <= n.length ? [null, n, null] : tu.exec(n)) || !e[1] && t) return !t || t.jquery ? (t || r).find(n) : this.constructor(t).find(n);
            if (e[1]) {
                if (t = t instanceof i ? t[0] : t, i.merge(this, i.parseHTML(e[1], t && t.nodeType ? t.ownerDocument || t : f, !0)), wi.test(e[1]) && i.isPlainObject(t))
                    for (e in t) u(this[e]) ? this[e](t[e]) : this.attr(e, t[e]);
                return this
            }
            return (o = f.getElementById(e[2])) && (this[0] = o, this.length = 1), this
        }
        return n.nodeType ? (this[0] = n, this.length = 1, this) : u(n) ? void 0 !== r.ready ? r.ready(n) : n(i) : i.makeArray(n, this)
    }).prototype = i.fn;
    nu = i(f);
    iu = /^(?:parents|prev(?:Until|All))/;
    ru = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
    };
    i.fn.extend({
        has: function(n) {
            var t = i(n, this),
                r = t.length;
            return this.filter(function() {
                for (var n = 0; n < r; n++)
                    if (i.contains(this, t[n])) return !0
            })
        },
        closest: function(n, t) {
            var r, f = 0,
                o = this.length,
                u = [],
                e = "string" != typeof n && i(n);
            if (!gr.test(n))
                for (; f < o; f++)
                    for (r = this[f]; r && r !== t; r = r.parentNode)
                        if (r.nodeType < 11 && (e ? -1 < e.index(r) : 1 === r.nodeType && i.find.matchesSelector(r, n))) {
                            u.push(r);
                            break
                        } return this.pushStack(1 < u.length ? i.uniqueSort(u) : u)
        },
        index: function(n) {
            return n ? "string" == typeof n ? ii.call(i(n), this[0]) : ii.call(this, n.jquery ? n[0] : n) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(n, t) {
            return this.pushStack(i.uniqueSort(i.merge(this.get(), i(n, t))))
        },
        addBack: function(n) {
            return this.add(null == n ? this.prevObject : this.prevObject.filter(n))
        }
    });
    i.each({
        parent: function(n) {
            var t = n.parentNode;
            return t && 11 !== t.nodeType ? t : null
        },
        parents: function(n) {
            return ft(n, "parentNode")
        },
        parentsUntil: function(n, t, i) {
            return ft(n, "parentNode", i)
        },
        next: function(n) {
            return uu(n, "nextSibling")
        },
        prev: function(n) {
            return uu(n, "previousSibling")
        },
        nextAll: function(n) {
            return ft(n, "nextSibling")
        },
        prevAll: function(n) {
            return ft(n, "previousSibling")
        },
        nextUntil: function(n, t, i) {
            return ft(n, "nextSibling", i)
        },
        prevUntil: function(n, t, i) {
            return ft(n, "previousSibling", i)
        },
        siblings: function(n) {
            return dr((n.parentNode || {}).firstChild, n)
        },
        children: function(n) {
            return dr(n.firstChild)
        },
        contents: function(n) {
            return null != n.contentDocument && vr(n.contentDocument) ? n.contentDocument : (c(n, "template") && (n = n.content || n), i.merge([], n.childNodes))
        }
    }, function(n, t) {
        i.fn[n] = function(r, u) {
            var f = i.map(this, t, r);
            return "Until" !== n.slice(-5) && (u = r), u && "string" == typeof u && (f = i.filter(u, f)), 1 < this.length && (ru[n] || i.uniqueSort(f), iu.test(n) && f.reverse()), this.pushStack(f)
        }
    });
    l = /[^\x20\t\r\n\f]+/g;
    i.Callbacks = function(n) {
        var a, h;
        n = "string" == typeof n ? (a = n, h = {}, i.each(a.match(l) || [], function(n, t) {
            h[t] = !0
        }), h) : i.extend({}, n);
        var o, r, v, f, t = [],
            s = [],
            e = -1,
            y = function() {
                for (f = f || n.once, v = o = !0; s.length; e = -1)
                    for (r = s.shift(); ++e < t.length;) !1 === t[e].apply(r[0], r[1]) && n.stopOnFalse && (e = t.length, r = !1);
                n.memory || (r = !1);
                o = !1;
                f && (t = r ? [] : "")
            },
            c = {
                add: function() {
                    return t && (r && !o && (e = t.length - 1, s.push(r)), function f(r) {
                        i.each(r, function(i, r) {
                            u(r) ? n.unique && c.has(r) || t.push(r) : r && r.length && "string" !== ut(r) && f(r)
                        })
                    }(arguments), r && !o && y()), this
                },
                remove: function() {
                    return i.each(arguments, function(n, r) {
                        for (var u; - 1 < (u = i.inArray(r, t, u));) t.splice(u, 1), u <= e && e--
                    }), this
                },
                has: function(n) {
                    return n ? -1 < i.inArray(n, t) : 0 < t.length
                },
                empty: function() {
                    return t && (t = []), this
                },
                disable: function() {
                    return f = s = [], t = r = "", this
                },
                disabled: function() {
                    return !t
                },
                lock: function() {
                    return f = s = [], r || o || (t = r = ""), this
                },
                locked: function() {
                    return !!f
                },
                fireWith: function(n, t) {
                    return f || (t = [n, (t = t || []).slice ? t.slice() : t], s.push(t), o || y()), this
                },
                fire: function() {
                    return c.fireWith(this, arguments), this
                },
                fired: function() {
                    return !!v
                }
            };
        return c
    };
    i.extend({
        Deferred: function(t) {
            var f = [
                    ["notify", "progress", i.Callbacks("memory"), i.Callbacks("memory"), 2],
                    ["resolve", "done", i.Callbacks("once memory"), i.Callbacks("once memory"), 0, "resolved"],
                    ["reject", "fail", i.Callbacks("once memory"), i.Callbacks("once memory"), 1, "rejected"]
                ],
                o = "pending",
                e = {
                    state: function() {
                        return o
                    },
                    always: function() {
                        return r.done(arguments).fail(arguments), this
                    },
                    "catch": function(n) {
                        return e.then(null, n)
                    },
                    pipe: function() {
                        var n = arguments;
                        return i.Deferred(function(t) {
                            i.each(f, function(i, f) {
                                var e = u(n[f[4]]) && n[f[4]];
                                r[f[1]](function() {
                                    var n = e && e.apply(this, arguments);
                                    n && u(n.promise) ? n.promise().progress(t.notify).done(t.resolve).fail(t.reject) : t[f[0] + "With"](this, e ? [n] : arguments)
                                })
                            });
                            n = null
                        }).promise()
                    },
                    then: function(t, r, e) {
                        function s(t, r, f, e) {
                            return function() {
                                var h = this,
                                    c = arguments,
                                    l = function() {
                                        var n, i;
                                        if (!(t < o)) {
                                            if ((n = f.apply(h, c)) === r.promise()) throw new TypeError("Thenable self-resolution");
                                            i = n && ("object" == typeof n || "function" == typeof n) && n.then;
                                            u(i) ? e ? i.call(n, s(o, r, et, e), s(o, r, fi, e)) : (o++, i.call(n, s(o, r, et, e), s(o, r, fi, e), s(o, r, et, r.notifyWith))) : (f !== et && (h = void 0, c = [n]), (e || r.resolveWith)(h, c))
                                        }
                                    },
                                    a = e ? l : function() {
                                        try {
                                            l()
                                        } catch (l) {
                                            i.Deferred.exceptionHook && i.Deferred.exceptionHook(l, a.stackTrace);
                                            o <= t + 1 && (f !== fi && (h = void 0, c = [l]), r.rejectWith(h, c))
                                        }
                                    };
                                t ? a() : (i.Deferred.getStackHook && (a.stackTrace = i.Deferred.getStackHook()), n.setTimeout(a))
                            }
                        }
                        var o = 0;
                        return i.Deferred(function(n) {
                            f[0][3].add(s(0, n, u(e) ? e : et, n.notifyWith));
                            f[1][3].add(s(0, n, u(t) ? t : et));
                            f[2][3].add(s(0, n, u(r) ? r : fi))
                        }).promise()
                    },
                    promise: function(n) {
                        return null != n ? i.extend(n, e) : e
                    }
                },
                r = {};
            return i.each(f, function(n, t) {
                var i = t[2],
                    u = t[5];
                e[t[1]] = i.add;
                u && i.add(function() {
                    o = u
                }, f[3 - n][2].disable, f[3 - n][3].disable, f[0][2].lock, f[0][3].lock);
                i.add(t[3].fire);
                r[t[0]] = function() {
                    return r[t[0] + "With"](this === r ? void 0 : this, arguments), this
                };
                r[t[0] + "With"] = i.fireWith
            }), e.promise(r), t && t.call(r, r), r
        },
        when: function(n) {
            var e = arguments.length,
                t = e,
                o = Array(t),
                f = k.call(arguments),
                r = i.Deferred(),
                s = function(n) {
                    return function(t) {
                        o[n] = this;
                        f[n] = 1 < arguments.length ? k.call(arguments) : t;
                        --e || r.resolveWith(o, f)
                    }
                };
            if (e <= 1 && (fu(n, r.done(s(t)).resolve, r.reject, !e), "pending" === r.state() || u(f[t] && f[t].then))) return r.then();
            while (t--) fu(f[t], s(t), r.reject);
            return r.promise()
        }
    });
    eu = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
    i.Deferred.exceptionHook = function(t, i) {
        n.console && n.console.warn && t && eu.test(t.name) && n.console.warn("jQuery.Deferred exception: " + t.message, t.stack, i)
    };
    i.readyException = function(t) {
        n.setTimeout(function() {
            throw t;
        })
    };
    ei = i.Deferred();
    i.fn.ready = function(n) {
        return ei.then(n)["catch"](function(n) {
            i.readyException(n)
        }), this
    };
    i.extend({
        isReady: !1,
        readyWait: 1,
        ready: function(n) {
            (!0 === n ? --i.readyWait : i.isReady) || (i.isReady = !0) !== n && 0 < --i.readyWait || ei.resolveWith(f, [i])
        }
    });
    i.ready.then = ei.then;
    "complete" === f.readyState || "loading" !== f.readyState && !f.documentElement.doScroll ? n.setTimeout(i.ready) : (f.addEventListener("DOMContentLoaded", oi), n.addEventListener("load", oi));
    var w = function(n, t, r, f, e, o, s) {
            var h = 0,
                l = n.length,
                c = null == r;
            if ("object" === ut(r))
                for (h in e = !0, r) w(n, t, h, r[h], !0, o, s);
            else if (void 0 !== f && (e = !0, u(f) || (s = !0), c && (s ? (t.call(n, f), t = null) : (c = t, t = function(n, t, r) {
                    return c.call(i(n), r)
                })), t))
                for (; h < l; h++) t(n[h], r, s ? f : f.call(n[h], h, t(n[h], r)));
            return e ? n : c ? t.call(n) : l ? t(n[0], r) : o
        },
        se = /^-ms-/,
        he = /-([a-z])/g;
    ot = function(n) {
        return 1 === n.nodeType || 9 === n.nodeType || !+n.nodeType
    };
    bt.uid = 1;
    bt.prototype = {
        cache: function(n) {
            var t = n[this.expando];
            return t || (t = {}, ot(n) && (n.nodeType ? n[this.expando] = t : Object.defineProperty(n, this.expando, {
                value: t,
                configurable: !0
            }))), t
        },
        set: function(n, t, i) {
            var r, u = this.cache(n);
            if ("string" == typeof t) u[y(t)] = i;
            else
                for (r in t) u[y(r)] = t[r];
            return u
        },
        get: function(n, t) {
            return void 0 === t ? this.cache(n) : n[this.expando] && n[this.expando][y(t)]
        },
        access: function(n, t, i) {
            return void 0 === t || t && "string" == typeof t && void 0 === i ? this.get(n, t) : (this.set(n, t, i), void 0 !== i ? i : t)
        },
        remove: function(n, t) {
            var u, r = n[this.expando];
            if (void 0 !== r) {
                if (void 0 !== t)
                    for (u = (t = Array.isArray(t) ? t.map(y) : (t = y(t)) in r ? [t] : t.match(l) || []).length; u--;) delete r[t[u]];
                (void 0 === t || i.isEmptyObject(r)) && (n.nodeType ? n[this.expando] = void 0 : delete n[this.expando])
            }
        },
        hasData: function(n) {
            var t = n[this.expando];
            return void 0 !== t && !i.isEmptyObject(t)
        }
    };
    var r = new bt,
        o = new bt,
        le = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
        ae = /[A-Z]/g;
    i.extend({
        hasData: function(n) {
            return o.hasData(n) || r.hasData(n)
        },
        data: function(n, t, i) {
            return o.access(n, t, i)
        },
        removeData: function(n, t) {
            o.remove(n, t)
        },
        _data: function(n, t, i) {
            return r.access(n, t, i)
        },
        _removeData: function(n, t) {
            r.remove(n, t)
        }
    });
    i.fn.extend({
        data: function(n, t) {
            var f, u, e, i = this[0],
                s = i && i.attributes;
            if (void 0 === n) {
                if (this.length && (e = o.get(i), 1 === i.nodeType && !r.get(i, "hasDataAttrs"))) {
                    for (f = s.length; f--;) s[f] && 0 === (u = s[f].name).indexOf("data-") && (u = y(u.slice(5)), ou(i, u, e[u]));
                    r.set(i, "hasDataAttrs", !0)
                }
                return e
            }
            return "object" == typeof n ? this.each(function() {
                o.set(this, n)
            }) : w(this, function(t) {
                var r;
                if (i && void 0 === t) return void 0 !== (r = o.get(i, n)) ? r : void 0 !== (r = ou(i, n)) ? r : void 0;
                this.each(function() {
                    o.set(this, n, t)
                })
            }, null, t, 1 < arguments.length, null, !0)
        },
        removeData: function(n) {
            return this.each(function() {
                o.remove(this, n)
            })
        }
    });
    i.extend({
        queue: function(n, t, u) {
            var f;
            if (n) return t = (t || "fx") + "queue", f = r.get(n, t), u && (!f || Array.isArray(u) ? f = r.access(n, t, i.makeArray(u)) : f.push(u)), f || []
        },
        dequeue: function(n, t) {
            t = t || "fx";
            var r = i.queue(n, t),
                e = r.length,
                u = r.shift(),
                f = i._queueHooks(n, t);
            "inprogress" === u && (u = r.shift(), e--);
            u && ("fx" === t && r.unshift("inprogress"), delete f.stop, u.call(n, function() {
                i.dequeue(n, t)
            }, f));
            !e && f && f.empty.fire()
        },
        _queueHooks: function(n, t) {
            var u = t + "queueHooks";
            return r.get(n, u) || r.access(n, u, {
                empty: i.Callbacks("once memory").add(function() {
                    r.remove(n, [t + "queue", u])
                })
            })
        }
    });
    i.fn.extend({
        queue: function(n, t) {
            var r = 2;
            return "string" != typeof n && (t = n, n = "fx", r--), arguments.length < r ? i.queue(this[0], n) : void 0 === t ? this : this.each(function() {
                var r = i.queue(this, n, t);
                i._queueHooks(this, n);
                "fx" === n && "inprogress" !== r[0] && i.dequeue(this, n)
            })
        },
        dequeue: function(n) {
            return this.each(function() {
                i.dequeue(this, n)
            })
        },
        clearQueue: function(n) {
            return this.queue(n || "fx", [])
        },
        promise: function(n, t) {
            var u, e = 1,
                o = i.Deferred(),
                f = this,
                s = this.length,
                h = function() {
                    --e || o.resolveWith(f, [f])
                };
            for ("string" != typeof n && (t = n, n = void 0), n = n || "fx"; s--;)(u = r.get(f[s], n + "queueHooks")) && u.empty && (e++, u.empty.add(h));
            return h(), o.promise(t)
        }
    });
    var su = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
        kt = new RegExp("^(?:([+-])=|)(" + su + ")([a-z%]*)$", "i"),
        b = ["Top", "Right", "Bottom", "Left"],
        g = f.documentElement,
        st = function(n) {
            return i.contains(n.ownerDocument, n)
        },
        ve = {
            composed: !0
        };
    g.getRootNode && (st = function(n) {
        return i.contains(n.ownerDocument, n) || n.getRootNode(ve) === n.ownerDocument
    });
    dt = function(n, t) {
        return "none" === (n = t || n).style.display || "" === n.style.display && st(n) && "none" === i.css(n, "display")
    };
    ki = {};
    i.fn.extend({
        show: function() {
            return ht(this, !0)
        },
        hide: function() {
            return ht(this)
        },
        toggle: function(n) {
            return "boolean" == typeof n ? n ? this.show() : this.hide() : this.each(function() {
                dt(this) ? i(this).show() : i(this).hide()
            })
        }
    });
    var nt, si, gt = /^(?:checkbox|radio)$/i,
        cu = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i,
        lu = /^$|^module$|\/(?:java|ecma)script/i;
    nt = f.createDocumentFragment().appendChild(f.createElement("div"));
    (si = f.createElement("input")).setAttribute("type", "radio");
    si.setAttribute("checked", "checked");
    si.setAttribute("name", "t");
    nt.appendChild(si);
    e.checkClone = nt.cloneNode(!0).cloneNode(!0).lastChild.checked;
    nt.innerHTML = "<textarea>x<\/textarea>";
    e.noCloneChecked = !!nt.cloneNode(!0).lastChild.defaultValue;
    nt.innerHTML = "<option><\/option>";
    e.option = !!nt.lastChild;
    h = {
        thead: [1, "<table>", "<\/table>"],
        col: [2, "<table><colgroup>", "<\/colgroup><\/table>"],
        tr: [2, "<table><tbody>", "<\/tbody><\/table>"],
        td: [3, "<table><tbody><tr>", "<\/tr><\/tbody><\/table>"],
        _default: [0, "", ""]
    };
    h.tbody = h.tfoot = h.colgroup = h.caption = h.thead;
    h.th = h.td;
    e.option || (h.optgroup = h.option = [1, "<select multiple='multiple'>", "<\/select>"]);
    au = /<|&#?\w+;/;
    var ye = /^key/,
        pe = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
        yu = /^([^.]*)(?:\.(.+)|)/;
    i.event = {
        global: {},
        add: function(n, t, u, f, e) {
            var p, a, k, v, w, h, s, c, o, b, d, y = r.get(n);
            if (ot(n))
                for (u.handler && (u = (p = u).handler, e = p.selector), e && i.find.matchesSelector(g, e), u.guid || (u.guid = i.guid++), (v = y.events) || (v = y.events = Object.create(null)), (a = y.handle) || (a = y.handle = function(t) {
                        if ("undefined" != typeof i && i.event.triggered !== t.type) return i.event.dispatch.apply(n, arguments)
                    }), w = (t = (t || "").match(l) || [""]).length; w--;) o = d = (k = yu.exec(t[w]) || [])[1], b = (k[2] || "").split(".").sort(), o && (s = i.event.special[o] || {}, o = (e ? s.delegateType : s.bindType) || o, s = i.event.special[o] || {}, h = i.extend({
                    type: o,
                    origType: d,
                    data: f,
                    handler: u,
                    guid: u.guid,
                    selector: e,
                    needsContext: e && i.expr.match.needsContext.test(e),
                    namespace: b.join(".")
                }, p), (c = v[o]) || ((c = v[o] = []).delegateCount = 0, s.setup && !1 !== s.setup.call(n, f, b, a) || n.addEventListener && n.addEventListener(o, a)), s.add && (s.add.call(n, h), h.handler.guid || (h.handler.guid = u.guid)), e ? c.splice(c.delegateCount++, 0, h) : c.push(h), i.event.global[o] = !0)
        },
        remove: function(n, t, u, f, e) {
            var y, k, c, v, p, s, h, a, o, b, d, w = r.hasData(n) && r.get(n);
            if (w && (v = w.events)) {
                for (p = (t = (t || "").match(l) || [""]).length; p--;)
                    if (o = d = (c = yu.exec(t[p]) || [])[1], b = (c[2] || "").split(".").sort(), o) {
                        for (h = i.event.special[o] || {}, a = v[o = (f ? h.delegateType : h.bindType) || o] || [], c = c[2] && new RegExp("(^|\\.)" + b.join("\\.(?:.*\\.|)") + "(\\.|$)"), k = y = a.length; y--;) s = a[y], !e && d !== s.origType || u && u.guid !== s.guid || c && !c.test(s.namespace) || f && f !== s.selector && ("**" !== f || !s.selector) || (a.splice(y, 1), s.selector && a.delegateCount--, h.remove && h.remove.call(n, s));
                        k && !a.length && (h.teardown && !1 !== h.teardown.call(n, b, w.handle) || i.removeEvent(n, o, w.handle), delete v[o])
                    } else
                        for (o in v) i.event.remove(n, o + t[p], u, f, !0);
                i.isEmptyObject(v) && r.remove(n, "handle events")
            }
        },
        dispatch: function(n) {
            var u, h, c, e, f, l, s = new Array(arguments.length),
                t = i.event.fix(n),
                a = (r.get(this, "events") || Object.create(null))[t.type] || [],
                o = i.event.special[t.type] || {};
            for (s[0] = t, u = 1; u < arguments.length; u++) s[u] = arguments[u];
            if (t.delegateTarget = this, !o.preDispatch || !1 !== o.preDispatch.call(this, t)) {
                for (l = i.event.handlers.call(this, t, a), u = 0;
                    (e = l[u++]) && !t.isPropagationStopped();)
                    for (t.currentTarget = e.elem, h = 0;
                        (f = e.handlers[h++]) && !t.isImmediatePropagationStopped();) t.rnamespace && !1 !== f.namespace && !t.rnamespace.test(f.namespace) || (t.handleObj = f, t.data = f.data, void 0 !== (c = ((i.event.special[f.origType] || {}).handle || f.handler).apply(e.elem, s)) && !1 === (t.result = c) && (t.preventDefault(), t.stopPropagation()));
                return o.postDispatch && o.postDispatch.call(this, t), t.result
            }
        },
        handlers: function(n, t) {
            var f, h, u, e, o, c = [],
                s = t.delegateCount,
                r = n.target;
            if (s && r.nodeType && !("click" === n.type && 1 <= n.button))
                for (; r !== this; r = r.parentNode || this)
                    if (1 === r.nodeType && ("click" !== n.type || !0 !== r.disabled)) {
                        for (e = [], o = {}, f = 0; f < s; f++) void 0 === o[u = (h = t[f]).selector + " "] && (o[u] = h.needsContext ? -1 < i(u, this).index(r) : i.find(u, this, null, [r]).length), o[u] && e.push(h);
                        e.length && c.push({
                            elem: r,
                            handlers: e
                        })
                    } return r = this, s < t.length && c.push({
                elem: r,
                handlers: t.slice(s)
            }), c
        },
        addProp: function(n, t) {
            Object.defineProperty(i.Event.prototype, n, {
                enumerable: !0,
                configurable: !0,
                get: u(t) ? function() {
                    if (this.originalEvent) return t(this.originalEvent)
                } : function() {
                    if (this.originalEvent) return this.originalEvent[n]
                },
                set: function(t) {
                    Object.defineProperty(this, n, {
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                        value: t
                    })
                }
            })
        },
        fix: function(n) {
            return n[i.expando] ? n : new i.Event(n)
        },
        special: {
            load: {
                noBubble: !0
            },
            click: {
                setup: function(n) {
                    var t = this || n;
                    return gt.test(t.type) && t.click && c(t, "input") && hi(t, "click", ct), !1
                },
                trigger: function(n) {
                    var t = this || n;
                    return gt.test(t.type) && t.click && c(t, "input") && hi(t, "click"), !0
                },
                _default: function(n) {
                    var t = n.target;
                    return gt.test(t.type) && t.click && c(t, "input") && r.get(t, "click") || c(t, "a")
                }
            },
            beforeunload: {
                postDispatch: function(n) {
                    void 0 !== n.result && n.originalEvent && (n.originalEvent.returnValue = n.result)
                }
            }
        }
    };
    i.removeEvent = function(n, t, i) {
        n.removeEventListener && n.removeEventListener(t, i)
    };
    i.Event = function(n, t) {
        if (!(this instanceof i.Event)) return new i.Event(n, t);
        n && n.type ? (this.originalEvent = n, this.type = n.type, this.isDefaultPrevented = n.defaultPrevented || void 0 === n.defaultPrevented && !1 === n.returnValue ? ct : lt, this.target = n.target && 3 === n.target.nodeType ? n.target.parentNode : n.target, this.currentTarget = n.currentTarget, this.relatedTarget = n.relatedTarget) : this.type = n;
        t && i.extend(this, t);
        this.timeStamp = n && n.timeStamp || Date.now();
        this[i.expando] = !0
    };
    i.Event.prototype = {
        constructor: i.Event,
        isDefaultPrevented: lt,
        isPropagationStopped: lt,
        isImmediatePropagationStopped: lt,
        isSimulated: !1,
        preventDefault: function() {
            var n = this.originalEvent;
            this.isDefaultPrevented = ct;
            n && !this.isSimulated && n.preventDefault()
        },
        stopPropagation: function() {
            var n = this.originalEvent;
            this.isPropagationStopped = ct;
            n && !this.isSimulated && n.stopPropagation()
        },
        stopImmediatePropagation: function() {
            var n = this.originalEvent;
            this.isImmediatePropagationStopped = ct;
            n && !this.isSimulated && n.stopImmediatePropagation();
            this.stopPropagation()
        }
    };
    i.each({
        altKey: !0,
        bubbles: !0,
        cancelable: !0,
        changedTouches: !0,
        ctrlKey: !0,
        detail: !0,
        eventPhase: !0,
        metaKey: !0,
        pageX: !0,
        pageY: !0,
        shiftKey: !0,
        view: !0,
        char: !0,
        code: !0,
        charCode: !0,
        key: !0,
        keyCode: !0,
        button: !0,
        buttons: !0,
        clientX: !0,
        clientY: !0,
        offsetX: !0,
        offsetY: !0,
        pointerId: !0,
        pointerType: !0,
        screenX: !0,
        screenY: !0,
        targetTouches: !0,
        toElement: !0,
        touches: !0,
        which: function(n) {
            var t = n.button;
            return null == n.which && ye.test(n.type) ? null != n.charCode ? n.charCode : n.keyCode : !n.which && void 0 !== t && pe.test(n.type) ? 1 & t ? 1 : 2 & t ? 3 : 4 & t ? 2 : 0 : n.which
        }
    }, i.event.addProp);
    i.each({
        focus: "focusin",
        blur: "focusout"
    }, function(n, t) {
        i.event.special[n] = {
            setup: function() {
                return hi(this, n, we), !1
            },
            trigger: function() {
                return hi(this, n), !0
            },
            delegateType: t
        }
    });
    i.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function(n, t) {
        i.event.special[n] = {
            delegateType: t,
            bindType: t,
            handle: function(n) {
                var u, r = n.relatedTarget,
                    f = n.handleObj;
                return r && (r === this || i.contains(this, r)) || (n.type = f.origType, u = f.handler.apply(this, arguments), n.type = t), u
            }
        }
    });
    i.fn.extend({
        on: function(n, t, i, r) {
            return gi(this, n, t, i, r)
        },
        one: function(n, t, i, r) {
            return gi(this, n, t, i, r, 1)
        },
        off: function(n, t, r) {
            var u, f;
            if (n && n.preventDefault && n.handleObj) return u = n.handleObj, i(n.delegateTarget).off(u.namespace ? u.origType + "." + u.namespace : u.origType, u.selector, u.handler), this;
            if ("object" == typeof n) {
                for (f in n) this.off(f, t, n[f]);
                return this
            }
            return !1 !== t && "function" != typeof t || (r = t, t = void 0), !1 === r && (r = lt), this.each(function() {
                i.event.remove(this, n, r, t)
            })
        }
    });
    var be = /<script|<style|<link/i,
        ke = /checked\s*(?:[^=]|=\s*.checked.)/i,
        de = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
    i.extend({
        htmlPrefilter: function(n) {
            return n
        },
        clone: function(n, t, r) {
            var u, c, o, f, l, a, v, h = n.cloneNode(!0),
                y = st(n);
            if (!(e.noCloneChecked || 1 !== n.nodeType && 11 !== n.nodeType || i.isXMLDoc(n)))
                for (f = s(h), u = 0, c = (o = s(n)).length; u < c; u++) l = o[u], a = f[u], void 0, "input" === (v = a.nodeName.toLowerCase()) && gt.test(l.type) ? a.checked = l.checked : "input" !== v && "textarea" !== v || (a.defaultValue = l.defaultValue);
            if (t)
                if (r)
                    for (o = o || s(n), f = f || s(h), u = 0, c = o.length; u < c; u++) wu(o[u], f[u]);
                else wu(n, h);
            return 0 < (f = s(h, "script")).length && di(f, !y && s(n, "script")), h
        },
        cleanData: function(n) {
            for (var u, t, f, s = i.event.special, e = 0; void 0 !== (t = n[e]); e++)
                if (ot(t)) {
                    if (u = t[r.expando]) {
                        if (u.events)
                            for (f in u.events) s[f] ? i.event.remove(t, f) : i.removeEvent(t, f, u.handle);
                        t[r.expando] = void 0
                    }
                    t[o.expando] && (t[o.expando] = void 0)
                }
        }
    });
    i.fn.extend({
        detach: function(n) {
            return bu(this, n, !0)
        },
        remove: function(n) {
            return bu(this, n)
        },
        text: function(n) {
            return w(this, function(n) {
                return void 0 === n ? i.text(this) : this.empty().each(function() {
                    1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = n)
                })
            }, null, n, arguments.length)
        },
        append: function() {
            return at(this, arguments, function(n) {
                1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || pu(this, n).appendChild(n)
            })
        },
        prepend: function() {
            return at(this, arguments, function(n) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = pu(this, n);
                    t.insertBefore(n, t.firstChild)
                }
            })
        },
        before: function() {
            return at(this, arguments, function(n) {
                this.parentNode && this.parentNode.insertBefore(n, this)
            })
        },
        after: function() {
            return at(this, arguments, function(n) {
                this.parentNode && this.parentNode.insertBefore(n, this.nextSibling)
            })
        },
        empty: function() {
            for (var n, t = 0; null != (n = this[t]); t++) 1 === n.nodeType && (i.cleanData(s(n, !1)), n.textContent = "");
            return this
        },
        clone: function(n, t) {
            return n = null != n && n, t = null == t ? n : t, this.map(function() {
                return i.clone(this, n, t)
            })
        },
        html: function(n) {
            return w(this, function(n) {
                var t = this[0] || {},
                    r = 0,
                    u = this.length;
                if (void 0 === n && 1 === t.nodeType) return t.innerHTML;
                if ("string" == typeof n && !be.test(n) && !h[(cu.exec(n) || ["", ""])[1].toLowerCase()]) {
                    n = i.htmlPrefilter(n);
                    try {
                        for (; r < u; r++) 1 === (t = this[r] || {}).nodeType && (i.cleanData(s(t, !1)), t.innerHTML = n);
                        t = 0
                    } catch (n) {}
                }
                t && this.empty().append(n)
            }, null, n, arguments.length)
        },
        replaceWith: function() {
            var n = [];
            return at(this, arguments, function(t) {
                var r = this.parentNode;
                i.inArray(this, n) < 0 && (i.cleanData(s(this)), r && r.replaceChild(t, this))
            }, n)
        }
    });
    i.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(n, t) {
        i.fn[n] = function(n) {
            for (var u, f = [], e = i(n), o = e.length - 1, r = 0; r <= o; r++) u = r === o ? this : this.clone(!0), i(e[r])[t](u), yi.apply(f, u.get());
            return this.pushStack(f)
        }
    });
    var nr = new RegExp("^(" + su + ")(?!px)[a-z%]+$", "i"),
        ci = function(t) {
            var i = t.ownerDocument.defaultView;
            return i && i.opener || (i = n), i.getComputedStyle(t)
        },
        ku = function(n, t, i) {
            var u, r, f = {};
            for (r in t) f[r] = n.style[r], n.style[r] = t[r];
            for (r in u = i.call(n), t) n.style[r] = f[r];
            return u
        },
        to = new RegExp(b.join("|"), "i");
    ! function() {
        function r() {
            if (t) {
                s.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0";
                t.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%";
                g.appendChild(s).appendChild(t);
                var i = n.getComputedStyle(t);
                h = "1%" !== i.top;
                v = 12 === u(i.marginLeft);
                t.style.right = "60%";
                a = 36 === u(i.right);
                c = 36 === u(i.width);
                t.style.position = "absolute";
                l = 12 === u(t.offsetWidth / 3);
                g.removeChild(s);
                t = null
            }
        }

        function u(n) {
            return Math.round(parseFloat(n))
        }
        var h, c, l, a, o, v, s = f.createElement("div"),
            t = f.createElement("div");
        t.style && (t.style.backgroundClip = "content-box", t.cloneNode(!0).style.backgroundClip = "", e.clearCloneStyle = "content-box" === t.style.backgroundClip, i.extend(e, {
            boxSizingReliable: function() {
                return r(), c
            },
            pixelBoxStyles: function() {
                return r(), a
            },
            pixelPosition: function() {
                return r(), h
            },
            reliableMarginLeft: function() {
                return r(), v
            },
            scrollboxSize: function() {
                return r(), l
            },
            reliableTrDimensions: function() {
                var t, i, r, u;
                return null == o && (t = f.createElement("table"), i = f.createElement("tr"), r = f.createElement("div"), t.style.cssText = "position:absolute;left:-11111px", i.style.height = "1px", r.style.height = "9px", g.appendChild(t).appendChild(i).appendChild(r), u = n.getComputedStyle(i), o = 3 < parseInt(u.height), g.removeChild(t)), o
            }
        }))
    }();
    var gu = ["Webkit", "Moz", "ms"],
        nf = f.createElement("div").style,
        tf = {};
    var io = /^(none|table(?!-c[ea]).+)/,
        rf = /^--/,
        ro = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        },
        uf = {
            letterSpacing: "0",
            fontWeight: "400"
        };
    i.extend({
        cssHooks: {
            opacity: {
                get: function(n, t) {
                    if (t) {
                        var i = ni(n, "opacity");
                        return "" === i ? "1" : i
                    }
                }
            }
        },
        cssNumber: {
            animationIterationCount: !0,
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            gridArea: !0,
            gridColumn: !0,
            gridColumnEnd: !0,
            gridColumnStart: !0,
            gridRow: !0,
            gridRowEnd: !0,
            gridRowStart: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {},
        style: function(n, t, r, u) {
            if (n && 3 !== n.nodeType && 8 !== n.nodeType && n.style) {
                var f, h, o, c = y(t),
                    l = rf.test(t),
                    s = n.style;
                if (l || (t = tr(c)), o = i.cssHooks[t] || i.cssHooks[c], void 0 === r) return o && "get" in o && void 0 !== (f = o.get(n, !1, u)) ? f : s[t];
                "string" == (h = typeof r) && (f = kt.exec(r)) && f[1] && (r = hu(n, t, f), h = "number");
                null != r && r == r && ("number" !== h || l || (r += f && f[3] || (i.cssNumber[c] ? "" : "px")), e.clearCloneStyle || "" !== r || 0 !== t.indexOf("background") || (s[t] = "inherit"), o && "set" in o && void 0 === (r = o.set(n, r, u)) || (l ? s.setProperty(t, r) : s[t] = r))
            }
        },
        css: function(n, t, r, u) {
            var f, e, o, s = y(t);
            return rf.test(t) || (t = tr(s)), (o = i.cssHooks[t] || i.cssHooks[s]) && "get" in o && (f = o.get(n, !0, r)), void 0 === f && (f = ni(n, t, u)), "normal" === f && t in uf && (f = uf[t]), "" === r || r ? (e = parseFloat(f), !0 === r || isFinite(e) ? e || 0 : f) : f
        }
    });
    i.each(["height", "width"], function(n, t) {
        i.cssHooks[t] = {
            get: function(n, r, u) {
                if (r) return !io.test(i.css(n, "display")) || n.getClientRects().length && n.getBoundingClientRect().width ? ef(n, t, u) : ku(n, ro, function() {
                    return ef(n, t, u)
                })
            },
            set: function(n, r, u) {
                var s, f = ci(n),
                    h = !e.scrollboxSize() && "absolute" === f.position,
                    c = (h || u) && "border-box" === i.css(n, "boxSizing", !1, f),
                    o = u ? ir(n, t, u, c, f) : 0;
                return c && h && (o -= Math.ceil(n["offset" + t[0].toUpperCase() + t.slice(1)] - parseFloat(f[t]) - ir(n, t, "border", !1, f) - .5)), o && (s = kt.exec(r)) && "px" !== (s[3] || "px") && (n.style[t] = r, r = i.css(n, t)), ff(0, r, o)
            }
        }
    });
    i.cssHooks.marginLeft = du(e.reliableMarginLeft, function(n, t) {
        if (t) return (parseFloat(ni(n, "marginLeft")) || n.getBoundingClientRect().left - ku(n, {
            marginLeft: 0
        }, function() {
            return n.getBoundingClientRect().left
        })) + "px"
    });
    i.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(n, t) {
        i.cssHooks[n + t] = {
            expand: function(i) {
                for (var r = 0, f = {}, u = "string" == typeof i ? i.split(" ") : [i]; r < 4; r++) f[n + b[r] + t] = u[r] || u[r - 2] || u[0];
                return f
            }
        };
        "margin" !== n && (i.cssHooks[n + t].set = ff)
    });
    i.fn.extend({
        css: function(n, t) {
            return w(this, function(n, t, r) {
                var f, e, o = {},
                    u = 0;
                if (Array.isArray(t)) {
                    for (f = ci(n), e = t.length; u < e; u++) o[t[u]] = i.css(n, t[u], !1, f);
                    return o
                }
                return void 0 !== r ? i.style(n, t, r) : i.css(n, t)
            }, n, t, 1 < arguments.length)
        }
    });
    ((i.Tween = a).prototype = {
        constructor: a,
        init: function(n, t, r, u, f, e) {
            this.elem = n;
            this.prop = r;
            this.easing = f || i.easing._default;
            this.options = t;
            this.start = this.now = this.cur();
            this.end = u;
            this.unit = e || (i.cssNumber[r] ? "" : "px")
        },
        cur: function() {
            var n = a.propHooks[this.prop];
            return n && n.get ? n.get(this) : a.propHooks._default.get(this)
        },
        run: function(n) {
            var t, r = a.propHooks[this.prop];
            return this.pos = this.options.duration ? t = i.easing[this.easing](n, this.options.duration * n, 0, 1, this.options.duration) : t = n, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), r && r.set ? r.set(this) : a.propHooks._default.set(this), this
        }
    }).init.prototype = a.prototype;
    (a.propHooks = {
        _default: {
            get: function(n) {
                var t;
                return 1 !== n.elem.nodeType || null != n.elem[n.prop] && null == n.elem.style[n.prop] ? n.elem[n.prop] : (t = i.css(n.elem, n.prop, "")) && "auto" !== t ? t : 0
            },
            set: function(n) {
                i.fx.step[n.prop] ? i.fx.step[n.prop](n) : 1 !== n.elem.nodeType || !i.cssHooks[n.prop] && null == n.elem.style[tr(n.prop)] ? n.elem[n.prop] = n.now : i.style(n.elem, n.prop, n.now + n.unit)
            }
        }
    }).scrollTop = a.propHooks.scrollLeft = {
        set: function(n) {
            n.elem.nodeType && n.elem.parentNode && (n.elem[n.prop] = n.now)
        }
    };
    i.easing = {
        linear: function(n) {
            return n
        },
        swing: function(n) {
            return .5 - Math.cos(n * Math.PI) / 2
        },
        _default: "swing"
    };
    i.fx = a.prototype.init;
    i.fx.step = {};
    sf = /^(?:toggle|show|hide)$/;
    hf = /queueHooks$/;
    i.Animation = i.extend(v, {
        tweeners: {
            "*": [function(n, t) {
                var i = this.createTween(n, t);
                return hu(i.elem, n, kt.exec(t), i), i
            }]
        },
        tweener: function(n, t) {
            u(n) ? (t = n, n = ["*"]) : n = n.match(l);
            for (var i, r = 0, f = n.length; r < f; r++) i = n[r], v.tweeners[i] = v.tweeners[i] || [], v.tweeners[i].unshift(t)
        },
        prefilters: [function(n, t, u) {
            var f, y, w, c, b, h, o, l, k = "width" in t || "height" in t,
                v = this,
                p = {},
                s = n.style,
                a = n.nodeType && dt(n),
                e = r.get(n, "fxshow");
            for (f in u.queue || (null == (c = i._queueHooks(n, "fx")).unqueued && (c.unqueued = 0, b = c.empty.fire, c.empty.fire = function() {
                    c.unqueued || b()
                }), c.unqueued++, v.always(function() {
                    v.always(function() {
                        c.unqueued--;
                        i.queue(n, "fx").length || c.empty.fire()
                    })
                })), t)
                if (y = t[f], sf.test(y)) {
                    if (delete t[f], w = w || "toggle" === y, y === (a ? "hide" : "show")) {
                        if ("show" !== y || !e || void 0 === e[f]) continue;
                        a = !0
                    }
                    p[f] = e && e[f] || i.style(n, f)
                } if ((h = !i.isEmptyObject(t)) || !i.isEmptyObject(p))
                for (f in k && 1 === n.nodeType && (u.overflow = [s.overflow, s.overflowX, s.overflowY], null == (o = e && e.display) && (o = r.get(n, "display")), "none" === (l = i.css(n, "display")) && (o ? l = o : (ht([n], !0), o = n.style.display || o, l = i.css(n, "display"), ht([n]))), ("inline" === l || "inline-block" === l && null != o) && "none" === i.css(n, "float") && (h || (v.done(function() {
                        s.display = o
                    }), null == o && (l = s.display, o = "none" === l ? "" : l)), s.display = "inline-block")), u.overflow && (s.overflow = "hidden", v.always(function() {
                        s.overflow = u.overflow[0];
                        s.overflowX = u.overflow[1];
                        s.overflowY = u.overflow[2]
                    })), h = !1, p) h || (e ? "hidden" in e && (a = e.hidden) : e = r.access(n, "fxshow", {
                    display: o
                }), w && (e.hidden = !a), a && ht([n], !0), v.done(function() {
                    for (f in a || ht([n]), r.remove(n, "fxshow"), p) i.style(n, f, p[f])
                })), h = lf(a ? e[f] : 0, f, v), f in e || (e[f] = h.start, a && (h.end = h.start, h.start = 0))
        }],
        prefilter: function(n, t) {
            t ? v.prefilters.unshift(n) : v.prefilters.push(n)
        }
    });
    i.speed = function(n, t, r) {
        var f = n && "object" == typeof n ? i.extend({}, n) : {
            complete: r || !r && t || u(n) && n,
            duration: n,
            easing: r && t || t && !u(t) && t
        };
        return i.fx.off ? f.duration = 0 : "number" != typeof f.duration && (f.duration = f.duration in i.fx.speeds ? i.fx.speeds[f.duration] : i.fx.speeds._default), null != f.queue && !0 !== f.queue || (f.queue = "fx"), f.old = f.complete, f.complete = function() {
            u(f.old) && f.old.call(this);
            f.queue && i.dequeue(this, f.queue)
        }, f
    };
    i.fn.extend({
        fadeTo: function(n, t, i, r) {
            return this.filter(dt).css("opacity", 0).show().end().animate({
                opacity: t
            }, n, i, r)
        },
        animate: function(n, t, u, f) {
            var s = i.isEmptyObject(n),
                o = i.speed(t, u, f),
                e = function() {
                    var t = v(this, i.extend({}, n), o);
                    (s || r.get(this, "finish")) && t.stop(!0)
                };
            return e.finish = e, s || !1 === o.queue ? this.each(e) : this.queue(o.queue, e)
        },
        stop: function(n, t, u) {
            var f = function(n) {
                var t = n.stop;
                delete n.stop;
                t(u)
            };
            return "string" != typeof n && (u = t, t = n, n = void 0), t && this.queue(n || "fx", []), this.each(function() {
                var s = !0,
                    t = null != n && n + "queueHooks",
                    o = i.timers,
                    e = r.get(this);
                if (t) e[t] && e[t].stop && f(e[t]);
                else
                    for (t in e) e[t] && e[t].stop && hf.test(t) && f(e[t]);
                for (t = o.length; t--;) o[t].elem !== this || null != n && o[t].queue !== n || (o[t].anim.stop(u), s = !1, o.splice(t, 1));
                !s && u || i.dequeue(this, n)
            })
        },
        finish: function(n) {
            return !1 !== n && (n = n || "fx"), this.each(function() {
                var t, e = r.get(this),
                    u = e[n + "queue"],
                    o = e[n + "queueHooks"],
                    f = i.timers,
                    s = u ? u.length : 0;
                for (e.finish = !0, i.queue(this, n, []), o && o.stop && o.stop.call(this, !0), t = f.length; t--;) f[t].elem === this && f[t].queue === n && (f[t].anim.stop(!0), f.splice(t, 1));
                for (t = 0; t < s; t++) u[t] && u[t].finish && u[t].finish.call(this);
                delete e.finish
            })
        }
    });
    i.each(["toggle", "show", "hide"], function(n, t) {
        var r = i.fn[t];
        i.fn[t] = function(n, i, u) {
            return null == n || "boolean" == typeof n ? r.apply(this, arguments) : this.animate(ai(t, !0), n, i, u)
        }
    });
    i.each({
        slideDown: ai("show"),
        slideUp: ai("hide"),
        slideToggle: ai("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(n, t) {
        i.fn[n] = function(n, i, r) {
            return this.animate(t, n, i, r)
        }
    });
    i.timers = [];
    i.fx.tick = function() {
        var r, n = 0,
            t = i.timers;
        for (vt = Date.now(); n < t.length; n++)(r = t[n])() || t[n] !== r || t.splice(n--, 1);
        t.length || i.fx.stop();
        vt = void 0
    };
    i.fx.timer = function(n) {
        i.timers.push(n);
        i.fx.start()
    };
    i.fx.interval = 13;
    i.fx.start = function() {
        li || (li = !0, rr())
    };
    i.fx.stop = function() {
        li = null
    };
    i.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    };
    i.fn.delay = function(t, r) {
        return t = i.fx && i.fx.speeds[t] || t, r = r || "fx", this.queue(r, function(i, r) {
            var u = n.setTimeout(i, t);
            r.stop = function() {
                n.clearTimeout(u)
            }
        })
    };
    yt = f.createElement("input"); of = f.createElement("select").appendChild(f.createElement("option"));
    yt.type = "checkbox";
    e.checkOn = "" !== yt.value;
    e.optSelected = of .selected;
    (yt = f.createElement("input")).value = "t";
    yt.type = "radio";
    e.radioValue = "t" === yt.value;
    pt = i.expr.attrHandle;
    i.fn.extend({
        attr: function(n, t) {
            return w(this, i.attr, n, t, 1 < arguments.length)
        },
        removeAttr: function(n) {
            return this.each(function() {
                i.removeAttr(this, n)
            })
        }
    });
    i.extend({
        attr: function(n, t, r) {
            var f, u, e = n.nodeType;
            if (3 !== e && 8 !== e && 2 !== e) return "undefined" == typeof n.getAttribute ? i.prop(n, t, r) : (1 === e && i.isXMLDoc(n) || (u = i.attrHooks[t.toLowerCase()] || (i.expr.match.bool.test(t) ? af : void 0)), void 0 !== r ? null === r ? void i.removeAttr(n, t) : u && "set" in u && void 0 !== (f = u.set(n, r, t)) ? f : (n.setAttribute(t, r + ""), r) : u && "get" in u && null !== (f = u.get(n, t)) ? f : null == (f = i.find.attr(n, t)) ? void 0 : f)
        },
        attrHooks: {
            type: {
                set: function(n, t) {
                    if (!e.radioValue && "radio" === t && c(n, "input")) {
                        var i = n.value;
                        return n.setAttribute("type", t), i && (n.value = i), t
                    }
                }
            }
        },
        removeAttr: function(n, t) {
            var i, u = 0,
                r = t && t.match(l);
            if (r && 1 === n.nodeType)
                while (i = r[u++]) n.removeAttribute(i)
        }
    });
    af = {
        set: function(n, t, r) {
            return !1 === t ? i.removeAttr(n, r) : n.setAttribute(r, r), r
        }
    };
    i.each(i.expr.match.bool.source.match(/\w+/g), function(n, t) {
        var r = pt[t] || i.find.attr;
        pt[t] = function(n, t, i) {
            var f, e, u = t.toLowerCase();
            return i || (e = pt[u], pt[u] = f, f = null != r(n, t, i) ? u : null, pt[u] = e), f
        }
    });
    vf = /^(?:input|select|textarea|button)$/i;
    yf = /^(?:a|area)$/i;
    i.fn.extend({
        prop: function(n, t) {
            return w(this, i.prop, n, t, 1 < arguments.length)
        },
        removeProp: function(n) {
            return this.each(function() {
                delete this[i.propFix[n] || n]
            })
        }
    });
    i.extend({
        prop: function(n, t, r) {
            var f, u, e = n.nodeType;
            if (3 !== e && 8 !== e && 2 !== e) return 1 === e && i.isXMLDoc(n) || (t = i.propFix[t] || t, u = i.propHooks[t]), void 0 !== r ? u && "set" in u && void 0 !== (f = u.set(n, r, t)) ? f : n[t] = r : u && "get" in u && null !== (f = u.get(n, t)) ? f : n[t]
        },
        propHooks: {
            tabIndex: {
                get: function(n) {
                    var t = i.find.attr(n, "tabindex");
                    return t ? parseInt(t, 10) : vf.test(n.nodeName) || yf.test(n.nodeName) && n.href ? 0 : -1
                }
            }
        },
        propFix: {
            "for": "htmlFor",
            "class": "className"
        }
    });
    e.optSelected || (i.propHooks.selected = {
        get: function(n) {
            var t = n.parentNode;
            return t && t.parentNode && t.parentNode.selectedIndex, null
        },
        set: function(n) {
            var t = n.parentNode;
            t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex)
        }
    });
    i.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
        i.propFix[this.toLowerCase()] = this
    });
    i.fn.extend({
        addClass: function(n) {
            var o, t, r, f, e, s, h, c = 0;
            if (u(n)) return this.each(function(t) {
                i(this).addClass(n.call(this, t, it(this)))
            });
            if ((o = ur(n)).length)
                while (t = this[c++])
                    if (f = it(t), r = 1 === t.nodeType && " " + tt(f) + " ") {
                        for (s = 0; e = o[s++];) r.indexOf(" " + e + " ") < 0 && (r += e + " ");
                        f !== (h = tt(r)) && t.setAttribute("class", h)
                    } return this
        },
        removeClass: function(n) {
            var o, r, t, f, e, s, h, c = 0;
            if (u(n)) return this.each(function(t) {
                i(this).removeClass(n.call(this, t, it(this)))
            });
            if (!arguments.length) return this.attr("class", "");
            if ((o = ur(n)).length)
                while (r = this[c++])
                    if (f = it(r), t = 1 === r.nodeType && " " + tt(f) + " ") {
                        for (s = 0; e = o[s++];)
                            while (-1 < t.indexOf(" " + e + " ")) t = t.replace(" " + e + " ", " ");
                        f !== (h = tt(t)) && r.setAttribute("class", h)
                    } return this
        },
        toggleClass: function(n, t) {
            var f = typeof n,
                e = "string" === f || Array.isArray(n);
            return "boolean" == typeof t && e ? t ? this.addClass(n) : this.removeClass(n) : u(n) ? this.each(function(r) {
                i(this).toggleClass(n.call(this, r, it(this), t), t)
            }) : this.each(function() {
                var t, o, u, s;
                if (e)
                    for (o = 0, u = i(this), s = ur(n); t = s[o++];) u.hasClass(t) ? u.removeClass(t) : u.addClass(t);
                else void 0 !== n && "boolean" !== f || ((t = it(this)) && r.set(this, "__className__", t), this.setAttribute && this.setAttribute("class", t || !1 === n ? "" : r.get(this, "__className__") || ""))
            })
        },
        hasClass: function(n) {
            for (var t, r = 0, i = " " + n + " "; t = this[r++];)
                if (1 === t.nodeType && -1 < (" " + tt(it(t)) + " ").indexOf(i)) return !0;
            return !1
        }
    });
    pf = /\r/g;
    i.fn.extend({
        val: function(n) {
            var t, r, e, f = this[0];
            return arguments.length ? (e = u(n), this.each(function(r) {
                var u;
                1 === this.nodeType && (null == (u = e ? n.call(this, r, i(this).val()) : n) ? u = "" : "number" == typeof u ? u += "" : Array.isArray(u) && (u = i.map(u, function(n) {
                    return null == n ? "" : n + ""
                })), (t = i.valHooks[this.type] || i.valHooks[this.nodeName.toLowerCase()]) && "set" in t && void 0 !== t.set(this, u, "value") || (this.value = u))
            })) : f ? (t = i.valHooks[f.type] || i.valHooks[f.nodeName.toLowerCase()]) && "get" in t && void 0 !== (r = t.get(f, "value")) ? r : "string" == typeof(r = f.value) ? r.replace(pf, "") : null == r ? "" : r : void 0
        }
    });
    i.extend({
        valHooks: {
            option: {
                get: function(n) {
                    var t = i.find.attr(n, "value");
                    return null != t ? t : tt(i.text(n))
                }
            },
            select: {
                get: function(n) {
                    for (var e, t, o = n.options, u = n.selectedIndex, f = "select-one" === n.type, s = f ? null : [], h = f ? u + 1 : o.length, r = u < 0 ? h : f ? u : 0; r < h; r++)
                        if (((t = o[r]).selected || r === u) && !t.disabled && (!t.parentNode.disabled || !c(t.parentNode, "optgroup"))) {
                            if (e = i(t).val(), f) return e;
                            s.push(e)
                        } return s
                },
                set: function(n, t) {
                    for (var r, u, f = n.options, e = i.makeArray(t), o = f.length; o--;)((u = f[o]).selected = -1 < i.inArray(i.valHooks.option.get(u), e)) && (r = !0);
                    return r || (n.selectedIndex = -1), e
                }
            }
        }
    });
    i.each(["radio", "checkbox"], function() {
        i.valHooks[this] = {
            set: function(n, t) {
                if (Array.isArray(t)) return n.checked = -1 < i.inArray(i(n).val(), t)
            }
        };
        e.checkOn || (i.valHooks[this].get = function(n) {
            return null === n.getAttribute("value") ? "on" : n.value
        })
    });
    e.focusin = "onfocusin" in n;
    fr = /^(?:focusinfocus|focusoutblur)$/;
    er = function(n) {
        n.stopPropagation()
    };
    i.extend(i.event, {
        trigger: function(t, e, o, s) {
            var k, c, l, d, v, y, a, p, w = [o || f],
                h = ui.call(t, "type") ? t.type : t,
                b = ui.call(t, "namespace") ? t.namespace.split(".") : [];
            if (c = p = l = o = o || f, 3 !== o.nodeType && 8 !== o.nodeType && !fr.test(h + i.event.triggered) && (-1 < h.indexOf(".") && (h = (b = h.split(".")).shift(), b.sort()), v = h.indexOf(":") < 0 && "on" + h, (t = t[i.expando] ? t : new i.Event(h, "object" == typeof t && t)).isTrigger = s ? 2 : 3, t.namespace = b.join("."), t.rnamespace = t.namespace ? new RegExp("(^|\\.)" + b.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, t.result = void 0, t.target || (t.target = o), e = null == e ? [t] : i.makeArray(e, [t]), a = i.event.special[h] || {}, s || !a.trigger || !1 !== a.trigger.apply(o, e))) {
                if (!s && !a.noBubble && !rt(o)) {
                    for (d = a.delegateType || h, fr.test(d + h) || (c = c.parentNode); c; c = c.parentNode) w.push(c), l = c;
                    l === (o.ownerDocument || f) && w.push(l.defaultView || l.parentWindow || n)
                }
                for (k = 0;
                    (c = w[k++]) && !t.isPropagationStopped();) p = c, t.type = 1 < k ? d : a.bindType || h, (y = (r.get(c, "events") || Object.create(null))[t.type] && r.get(c, "handle")) && y.apply(c, e), (y = v && c[v]) && y.apply && ot(c) && (t.result = y.apply(c, e), !1 === t.result && t.preventDefault());
                return t.type = h, s || t.isDefaultPrevented() || a._default && !1 !== a._default.apply(w.pop(), e) || !ot(o) || v && u(o[h]) && !rt(o) && ((l = o[v]) && (o[v] = null), i.event.triggered = h, t.isPropagationStopped() && p.addEventListener(h, er), o[h](), t.isPropagationStopped() && p.removeEventListener(h, er), i.event.triggered = void 0, l && (o[v] = l)), t.result
            }
        },
        simulate: function(n, t, r) {
            var u = i.extend(new i.Event, r, {
                type: n,
                isSimulated: !0
            });
            i.event.trigger(u, null, t)
        }
    });
    i.fn.extend({
        trigger: function(n, t) {
            return this.each(function() {
                i.event.trigger(n, t, this)
            })
        },
        triggerHandler: function(n, t) {
            var r = this[0];
            if (r) return i.event.trigger(n, t, r, !0)
        }
    });
    e.focusin || i.each({
        focus: "focusin",
        blur: "focusout"
    }, function(n, t) {
        var u = function(n) {
            i.event.simulate(t, n.target, i.event.fix(n))
        };
        i.event.special[t] = {
            setup: function() {
                var i = this.ownerDocument || this.document || this,
                    f = r.access(i, t);
                f || i.addEventListener(n, u, !0);
                r.access(i, t, (f || 0) + 1)
            },
            teardown: function() {
                var i = this.ownerDocument || this.document || this,
                    f = r.access(i, t) - 1;
                f ? r.access(i, t, f) : (i.removeEventListener(n, u, !0), r.remove(i, t))
            }
        }
    });
    var ti = n.location,
        wf = {
            guid: Date.now()
        },
        or = /\?/;
    i.parseXML = function(t) {
        var r;
        if (!t || "string" != typeof t) return null;
        try {
            r = (new n.DOMParser).parseFromString(t, "text/xml")
        } catch (t) {
            r = void 0
        }
        return r && !r.getElementsByTagName("parsererror").length || i.error("Invalid XML: " + t), r
    };
    var uo = /\[\]$/,
        bf = /\r?\n/g,
        fo = /^(?:submit|button|image|reset|file)$/i,
        eo = /^(?:input|select|textarea|keygen)/i;
    i.param = function(n, t) {
        var r, f = [],
            e = function(n, t) {
                var i = u(t) ? t() : t;
                f[f.length] = encodeURIComponent(n) + "=" + encodeURIComponent(null == i ? "" : i)
            };
        if (null == n) return "";
        if (Array.isArray(n) || n.jquery && !i.isPlainObject(n)) i.each(n, function() {
            e(this.name, this.value)
        });
        else
            for (r in n) sr(r, n[r], t, e);
        return f.join("&")
    };
    i.fn.extend({
        serialize: function() {
            return i.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var n = i.prop(this, "elements");
                return n ? i.makeArray(n) : this
            }).filter(function() {
                var n = this.type;
                return this.name && !i(this).is(":disabled") && eo.test(this.nodeName) && !fo.test(n) && (this.checked || !gt.test(n))
            }).map(function(n, t) {
                var r = i(this).val();
                return null == r ? null : Array.isArray(r) ? i.map(r, function(n) {
                    return {
                        name: t.name,
                        value: n.replace(bf, "\r\n")
                    }
                }) : {
                    name: t.name,
                    value: r.replace(bf, "\r\n")
                }
            }).get()
        }
    });
    var oo = /%20/g,
        so = /#.*$/,
        ho = /([?&])_=[^&]*/,
        co = /^(.*?):[ \t]*([^\r\n]*)$/gm,
        lo = /^(?:GET|HEAD)$/,
        ao = /^\/\//,
        kf = {},
        hr = {},
        df = "*/".concat("*"),
        cr = f.createElement("a");
    return cr.href = ti.href, i.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: ti.href,
            type: "GET",
            isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(ti.protocol),
            global: !0,
            processData: !0,
            "async": !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": df,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /\bxml\b/,
                html: /\bhtml/,
                json: /\bjson\b/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": JSON.parse,
                "text xml": i.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(n, t) {
            return t ? lr(lr(n, i.ajaxSettings), t) : lr(i.ajaxSettings, n)
        },
        ajaxPrefilter: gf(kf),
        ajaxTransport: gf(hr),
        ajax: function(t, r) {
            function b(t, r, f, c) {
                var v, rt, b, p, g, l = r;
                s || (s = !0, d && n.clearTimeout(d), a = void 0, k = c || "", e.readyState = 0 < t ? 4 : 0, v = 200 <= t && t < 300 || 304 === t, f && (p = function(n, t, i) {
                    for (var e, u, f, o, s = n.contents, r = n.dataTypes;
                        "*" === r[0];) r.shift(), void 0 === e && (e = n.mimeType || t.getResponseHeader("Content-Type"));
                    if (e)
                        for (u in s)
                            if (s[u] && s[u].test(e)) {
                                r.unshift(u);
                                break
                            } if (r[0] in i) f = r[0];
                    else {
                        for (u in i) {
                            if (!r[0] || n.converters[u + " " + r[0]]) {
                                f = u;
                                break
                            }
                            o || (o = u)
                        }
                        f = f || o
                    }
                    if (f) return f !== r[0] && r.unshift(f), i[f]
                }(u, e, f)), !v && -1 < i.inArray("script", u.dataTypes) && (u.converters["text script"] = function() {}), p = function(n, t, i, r) {
                    var h, u, f, s, e, o = {},
                        c = n.dataTypes.slice();
                    if (c[1])
                        for (f in n.converters) o[f.toLowerCase()] = n.converters[f];
                    for (u = c.shift(); u;)
                        if (n.responseFields[u] && (i[n.responseFields[u]] = t), !e && r && n.dataFilter && (t = n.dataFilter(t, n.dataType)), e = u, u = c.shift())
                            if ("*" === u) u = e;
                            else if ("*" !== e && e !== u) {
                        if (!(f = o[e + " " + u] || o["* " + u]))
                            for (h in o)
                                if ((s = h.split(" "))[1] === u && (f = o[e + " " + s[0]] || o["* " + s[0]])) {
                                    !0 === f ? f = o[h] : !0 !== o[h] && (u = s[0], c.unshift(s[1]));
                                    break
                                } if (!0 !== f)
                            if (f && n.throws) t = f(t);
                            else try {
                                t = f(t)
                            } catch (n) {
                                return {
                                    state: "parsererror",
                                    error: f ? n : "No conversion from " + e + " to " + u
                                }
                            }
                    }
                    return {
                        state: "success",
                        data: t
                    }
                }(u, p, e, v), v ? (u.ifModified && ((g = e.getResponseHeader("Last-Modified")) && (i.lastModified[o] = g), (g = e.getResponseHeader("etag")) && (i.etag[o] = g)), 204 === t || "HEAD" === u.type ? l = "nocontent" : 304 === t ? l = "notmodified" : (l = p.state, rt = p.data, v = !(b = p.error))) : (b = l, !t && l || (l = "error", t < 0 && (t = 0))), e.status = t, e.statusText = (r || l) + "", v ? tt.resolveWith(h, [rt, l, e]) : tt.rejectWith(h, [e, l, b]), e.statusCode(w), w = void 0, y && nt.trigger(v ? "ajaxSuccess" : "ajaxError", [e, u, v ? rt : b]), it.fireWith(h, [e, l]), y && (nt.trigger("ajaxComplete", [e, u]), --i.active || i.event.trigger("ajaxStop")))
            }
            "object" == typeof t && (r = t, t = void 0);
            r = r || {};
            var a, o, k, v, d, c, s, y, g, p, u = i.ajaxSetup({}, r),
                h = u.context || u,
                nt = u.context && (h.nodeType || h.jquery) ? i(h) : i.event,
                tt = i.Deferred(),
                it = i.Callbacks("once memory"),
                w = u.statusCode || {},
                rt = {},
                ut = {},
                ft = "canceled",
                e = {
                    readyState: 0,
                    getResponseHeader: function(n) {
                        var t;
                        if (s) {
                            if (!v)
                                for (v = {}; t = co.exec(k);) v[t[1].toLowerCase() + " "] = (v[t[1].toLowerCase() + " "] || []).concat(t[2]);
                            t = v[n.toLowerCase() + " "]
                        }
                        return null == t ? null : t.join(", ")
                    },
                    getAllResponseHeaders: function() {
                        return s ? k : null
                    },
                    setRequestHeader: function(n, t) {
                        return null == s && (n = ut[n.toLowerCase()] = ut[n.toLowerCase()] || n, rt[n] = t), this
                    },
                    overrideMimeType: function(n) {
                        return null == s && (u.mimeType = n), this
                    },
                    statusCode: function(n) {
                        var t;
                        if (n)
                            if (s) e.always(n[e.status]);
                            else
                                for (t in n) w[t] = [w[t], n[t]];
                        return this
                    },
                    abort: function(n) {
                        var t = n || ft;
                        return a && a.abort(t), b(0, t), this
                    }
                };
            if (tt.promise(e), u.url = ((t || u.url || ti.href) + "").replace(ao, ti.protocol + "//"), u.type = r.method || r.type || u.method || u.type, u.dataTypes = (u.dataType || "*").toLowerCase().match(l) || [""], null == u.crossDomain) {
                c = f.createElement("a");
                try {
                    c.href = u.url;
                    c.href = c.href;
                    u.crossDomain = cr.protocol + "//" + cr.host != c.protocol + "//" + c.host
                } catch (t) {
                    u.crossDomain = !0
                }
            }
            if (u.data && u.processData && "string" != typeof u.data && (u.data = i.param(u.data, u.traditional)), ne(kf, u, r, e), s) return e;
            for (g in (y = i.event && u.global) && 0 == i.active++ && i.event.trigger("ajaxStart"), u.type = u.type.toUpperCase(), u.hasContent = !lo.test(u.type), o = u.url.replace(so, ""), u.hasContent ? u.data && u.processData && 0 === (u.contentType || "").indexOf("application/x-www-form-urlencoded") && (u.data = u.data.replace(oo, "+")) : (p = u.url.slice(o.length), u.data && (u.processData || "string" == typeof u.data) && (o += (or.test(o) ? "&" : "?") + u.data, delete u.data), !1 === u.cache && (o = o.replace(ho, "$1"), p = (or.test(o) ? "&" : "?") + "_=" + wf.guid++ + p), u.url = o + p), u.ifModified && (i.lastModified[o] && e.setRequestHeader("If-Modified-Since", i.lastModified[o]), i.etag[o] && e.setRequestHeader("If-None-Match", i.etag[o])), (u.data && u.hasContent && !1 !== u.contentType || r.contentType) && e.setRequestHeader("Content-Type", u.contentType), e.setRequestHeader("Accept", u.dataTypes[0] && u.accepts[u.dataTypes[0]] ? u.accepts[u.dataTypes[0]] + ("*" !== u.dataTypes[0] ? ", " + df + "; q=0.01" : "") : u.accepts["*"]), u.headers) e.setRequestHeader(g, u.headers[g]);
            if (u.beforeSend && (!1 === u.beforeSend.call(h, e, u) || s)) return e.abort();
            if (ft = "abort", it.add(u.complete), e.done(u.success), e.fail(u.error), a = ne(hr, u, r, e)) {
                if (e.readyState = 1, y && nt.trigger("ajaxSend", [e, u]), s) return e;
                u.async && 0 < u.timeout && (d = n.setTimeout(function() {
                    e.abort("timeout")
                }, u.timeout));
                try {
                    s = !1;
                    a.send(rt, b)
                } catch (t) {
                    if (s) throw t;
                    b(-1, t)
                }
            } else b(-1, "No Transport");
            return e
        },
        getJSON: function(n, t, r) {
            return i.get(n, t, r, "json")
        },
        getScript: function(n, t) {
            return i.get(n, void 0, t, "script")
        }
    }), i.each(["get", "post"], function(n, t) {
        i[t] = function(n, r, f, e) {
            return u(r) && (e = e || f, f = r, r = void 0), i.ajax(i.extend({
                url: n,
                type: t,
                dataType: e,
                data: r,
                success: f
            }, i.isPlainObject(n) && n))
        }
    }), i.ajaxPrefilter(function(n) {
        for (var t in n.headers) "content-type" === t.toLowerCase() && (n.contentType = n.headers[t] || "")
    }), i._evalUrl = function(n, t, r) {
        return i.ajax({
            url: n,
            type: "GET",
            dataType: "script",
            cache: !0,
            "async": !1,
            global: !1,
            converters: {
                "text script": function() {}
            },
            dataFilter: function(n) {
                i.globalEval(n, t, r)
            }
        })
    }, i.fn.extend({
        wrapAll: function(n) {
            var t;
            return this[0] && (u(n) && (n = n.call(this[0])), t = i(n, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && t.insertBefore(this[0]), t.map(function() {
                for (var n = this; n.firstElementChild;) n = n.firstElementChild;
                return n
            }).append(this)), this
        },
        wrapInner: function(n) {
            return u(n) ? this.each(function(t) {
                i(this).wrapInner(n.call(this, t))
            }) : this.each(function() {
                var t = i(this),
                    r = t.contents();
                r.length ? r.wrapAll(n) : t.append(n)
            })
        },
        wrap: function(n) {
            var t = u(n);
            return this.each(function(r) {
                i(this).wrapAll(t ? n.call(this, r) : n)
            })
        },
        unwrap: function(n) {
            return this.parent(n).not("body").each(function() {
                i(this).replaceWith(this.childNodes)
            }), this
        }
    }), i.expr.pseudos.hidden = function(n) {
        return !i.expr.pseudos.visible(n)
    }, i.expr.pseudos.visible = function(n) {
        return !!(n.offsetWidth || n.offsetHeight || n.getClientRects().length)
    }, i.ajaxSettings.xhr = function() {
        try {
            return new n.XMLHttpRequest
        } catch (t) {}
    }, te = {
        0: 200,
        1223: 204
    }, wt = i.ajaxSettings.xhr(), e.cors = !!wt && "withCredentials" in wt, e.ajax = wt = !!wt, i.ajaxTransport(function(t) {
        var i, r;
        if (e.cors || wt && !t.crossDomain) return {
            send: function(u, f) {
                var o, e = t.xhr();
                if (e.open(t.type, t.url, t.async, t.username, t.password), t.xhrFields)
                    for (o in t.xhrFields) e[o] = t.xhrFields[o];
                for (o in t.mimeType && e.overrideMimeType && e.overrideMimeType(t.mimeType), t.crossDomain || u["X-Requested-With"] || (u["X-Requested-With"] = "XMLHttpRequest"), u) e.setRequestHeader(o, u[o]);
                i = function(n) {
                    return function() {
                        i && (i = r = e.onload = e.onerror = e.onabort = e.ontimeout = e.onreadystatechange = null, "abort" === n ? e.abort() : "error" === n ? "number" != typeof e.status ? f(0, "error") : f(e.status, e.statusText) : f(te[e.status] || e.status, e.statusText, "text" !== (e.responseType || "text") || "string" != typeof e.responseText ? {
                            binary: e.response
                        } : {
                            text: e.responseText
                        }, e.getAllResponseHeaders()))
                    }
                };
                e.onload = i();
                r = e.onerror = e.ontimeout = i("error");
                void 0 !== e.onabort ? e.onabort = r : e.onreadystatechange = function() {
                    4 === e.readyState && n.setTimeout(function() {
                        i && r()
                    })
                };
                i = i("abort");
                try {
                    e.send(t.hasContent && t.data || null)
                } catch (u) {
                    if (i) throw u;
                }
            },
            abort: function() {
                i && i()
            }
        }
    }), i.ajaxPrefilter(function(n) {
        n.crossDomain && (n.contents.script = !1)
    }), i.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /\b(?:java|ecma)script\b/
        },
        converters: {
            "text script": function(n) {
                return i.globalEval(n), n
            }
        }
    }), i.ajaxPrefilter("script", function(n) {
        void 0 === n.cache && (n.cache = !1);
        n.crossDomain && (n.type = "GET")
    }), i.ajaxTransport("script", function(n) {
        var r, t;
        if (n.crossDomain || n.scriptAttrs) return {
            send: function(u, e) {
                r = i("<script>").attr(n.scriptAttrs || {}).prop({
                    charset: n.scriptCharset,
                    src: n.url
                }).on("load error", t = function(n) {
                    r.remove();
                    t = null;
                    n && e("error" === n.type ? 404 : 200, n.type)
                });
                f.head.appendChild(r[0])
            },
            abort: function() {
                t && t()
            }
        }
    }), ar = [], vi = /(=)\?(?=&|$)|\?\?/, i.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var n = ar.pop() || i.expando + "_" + wf.guid++;
            return this[n] = !0, n
        }
    }), i.ajaxPrefilter("json jsonp", function(t, r, f) {
        var e, o, s, h = !1 !== t.jsonp && (vi.test(t.url) ? "url" : "string" == typeof t.data && 0 === (t.contentType || "").indexOf("application/x-www-form-urlencoded") && vi.test(t.data) && "data");
        if (h || "jsonp" === t.dataTypes[0]) return e = t.jsonpCallback = u(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback, h ? t[h] = t[h].replace(vi, "$1" + e) : !1 !== t.jsonp && (t.url += (or.test(t.url) ? "&" : "?") + t.jsonp + "=" + e), t.converters["script json"] = function() {
            return s || i.error(e + " was not called"), s[0]
        }, t.dataTypes[0] = "json", o = n[e], n[e] = function() {
            s = arguments
        }, f.always(function() {
            void 0 === o ? i(n).removeProp(e) : n[e] = o;
            t[e] && (t.jsonpCallback = r.jsonpCallback, ar.push(e));
            s && u(o) && o(s[0]);
            s = o = void 0
        }), "script"
    }), e.createHTMLDocument = ((ie = f.implementation.createHTMLDocument("").body).innerHTML = "<form><\/form><form><\/form>", 2 === ie.childNodes.length), i.parseHTML = function(n, t, r) {
        return "string" != typeof n ? [] : ("boolean" == typeof t && (r = t, t = !1), t || (e.createHTMLDocument ? ((s = (t = f.implementation.createHTMLDocument("")).createElement("base")).href = f.location.href, t.head.appendChild(s)) : t = f), u = !r && [], (o = wi.exec(n)) ? [t.createElement(o[1])] : (o = vu([n], t, u), u && u.length && i(u).remove(), i.merge([], o.childNodes)));
        var s, o, u
    }, i.fn.load = function(n, t, r) {
        var f, s, h, e = this,
            o = n.indexOf(" ");
        return -1 < o && (f = tt(n.slice(o)), n = n.slice(0, o)), u(t) ? (r = t, t = void 0) : t && "object" == typeof t && (s = "POST"), 0 < e.length && i.ajax({
            url: n,
            type: s || "GET",
            dataType: "html",
            data: t
        }).done(function(n) {
            h = arguments;
            e.html(f ? i("<div>").append(i.parseHTML(n)).find(f) : n)
        }).always(r && function(n, t) {
            e.each(function() {
                r.apply(this, h || [n.responseText, t, n])
            })
        }), this
    }, i.expr.pseudos.animated = function(n) {
        return i.grep(i.timers, function(t) {
            return n === t.elem
        }).length
    }, i.offset = {
        setOffset: function(n, t, r) {
            var v, o, s, h, e, c, l = i.css(n, "position"),
                a = i(n),
                f = {};
            "static" === l && (n.style.position = "relative");
            e = a.offset();
            s = i.css(n, "top");
            c = i.css(n, "left");
            ("absolute" === l || "fixed" === l) && -1 < (s + c).indexOf("auto") ? (h = (v = a.position()).top, o = v.left) : (h = parseFloat(s) || 0, o = parseFloat(c) || 0);
            u(t) && (t = t.call(n, r, i.extend({}, e)));
            null != t.top && (f.top = t.top - e.top + h);
            null != t.left && (f.left = t.left - e.left + o);
            "using" in t ? t.using.call(n, f) : ("number" == typeof f.top && (f.top += "px"), "number" == typeof f.left && (f.left += "px"), a.css(f))
        }
    }, i.fn.extend({
        offset: function(n) {
            if (arguments.length) return void 0 === n ? this : this.each(function(t) {
                i.offset.setOffset(this, n, t)
            });
            var r, u, t = this[0];
            if (t) return t.getClientRects().length ? (r = t.getBoundingClientRect(), u = t.ownerDocument.defaultView, {
                top: r.top + u.pageYOffset,
                left: r.left + u.pageXOffset
            }) : {
                top: 0,
                left: 0
            }
        },
        position: function() {
            if (this[0]) {
                var n, r, u, t = this[0],
                    f = {
                        top: 0,
                        left: 0
                    };
                if ("fixed" === i.css(t, "position")) r = t.getBoundingClientRect();
                else {
                    for (r = this.offset(), u = t.ownerDocument, n = t.offsetParent || u.documentElement; n && (n === u.body || n === u.documentElement) && "static" === i.css(n, "position");) n = n.parentNode;
                    n && n !== t && 1 === n.nodeType && ((f = i(n).offset()).top += i.css(n, "borderTopWidth", !0), f.left += i.css(n, "borderLeftWidth", !0))
                }
                return {
                    top: r.top - f.top - i.css(t, "marginTop", !0),
                    left: r.left - f.left - i.css(t, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var n = this.offsetParent; n && "static" === i.css(n, "position");) n = n.offsetParent;
                return n || g
            })
        }
    }), i.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(n, t) {
        var r = "pageYOffset" === t;
        i.fn[n] = function(i) {
            return w(this, function(n, i, u) {
                var f;
                if (rt(n) ? f = n : 9 === n.nodeType && (f = n.defaultView), void 0 === u) return f ? f[t] : n[i];
                f ? f.scrollTo(r ? f.pageXOffset : u, r ? u : f.pageYOffset) : n[i] = u
            }, n, i, arguments.length)
        }
    }), i.each(["top", "left"], function(n, t) {
        i.cssHooks[t] = du(e.pixelPosition, function(n, r) {
            if (r) return r = ni(n, t), nr.test(r) ? i(n).position()[t] + "px" : r
        })
    }), i.each({
        Height: "height",
        Width: "width"
    }, function(n, t) {
        i.each({
            padding: "inner" + n,
            content: t,
            "": "outer" + n
        }, function(r, u) {
            i.fn[u] = function(f, e) {
                var o = arguments.length && (r || "boolean" != typeof f),
                    s = r || (!0 === f || !0 === e ? "margin" : "border");
                return w(this, function(t, r, f) {
                    var e;
                    return rt(t) ? 0 === u.indexOf("outer") ? t["inner" + n] : t.document.documentElement["client" + n] : 9 === t.nodeType ? (e = t.documentElement, Math.max(t.body["scroll" + n], e["scroll" + n], t.body["offset" + n], e["offset" + n], e["client" + n])) : void 0 === f ? i.css(t, r, s) : i.style(t, r, f, s)
                }, t, o ? f : void 0, o)
            }
        })
    }), i.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(n, t) {
        i.fn[t] = function(n) {
            return this.on(t, n)
        }
    }), i.fn.extend({
        bind: function(n, t, i) {
            return this.on(n, null, t, i)
        },
        unbind: function(n, t) {
            return this.off(n, null, t)
        },
        delegate: function(n, t, i, r) {
            return this.on(t, n, i, r)
        },
        undelegate: function(n, t, i) {
            return 1 === arguments.length ? this.off(n, "**") : this.off(t, n || "**", i)
        },
        hover: function(n, t) {
            return this.mouseenter(n).mouseleave(t || n)
        }
    }), i.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), function(n, t) {
        i.fn[t] = function(n, i) {
            return 0 < arguments.length ? this.on(t, null, n, i) : this.trigger(t)
        }
    }), re = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, i.proxy = function(n, t) {
        var r, f, e;
        if ("string" == typeof t && (r = n[t], t = n, n = r), u(n)) return f = k.call(arguments, 2), (e = function() {
            return n.apply(t || this, f.concat(k.call(arguments)))
        }).guid = n.guid = n.guid || i.guid++, e
    }, i.holdReady = function(n) {
        n ? i.readyWait++ : i.ready(!0)
    }, i.isArray = Array.isArray, i.parseJSON = JSON.parse, i.nodeName = c, i.isFunction = u, i.isWindow = rt, i.camelCase = y, i.type = ut, i.now = Date.now, i.isNumeric = function(n) {
        var t = i.type(n);
        return ("number" === t || "string" === t) && !isNaN(n - parseFloat(n))
    }, i.trim = function(n) {
        return null == n ? "" : (n + "").replace(re, "")
    }, "function" == typeof define && define.amd && define("jquery", [], function() {
        return i
    }), ue = n.jQuery, fe = n.$, i.noConflict = function(t) {
        return n.$ === i && (n.$ = fe), t && n.jQuery === i && (n.jQuery = ue), i
    }, "undefined" == typeof t && (n.jQuery = n.$ = i), i
}); + function(n) {
    "use strict";

    function r(t) {
        var i, r = t.attr("data-target") || (i = t.attr("href")) && i.replace(/.*(?=#[^\s]+$)/, "");
        return n(document).find(r)
    }

    function i(i) {
        return this.each(function() {
            var u = n(this),
                r = u.data("bs.collapse"),
                f = n.extend({}, t.DEFAULTS, u.data(), typeof i == "object" && i);
            !r && f.toggle && /show|hide/.test(i) && (f.toggle = !1);
            r || u.data("bs.collapse", r = new t(this, f));
            typeof i == "string" && r[i]()
        })
    }
    var t = function(i, r) {
            this.$element = n(i);
            this.options = n.extend({}, t.DEFAULTS, r);
            this.$trigger = n('[data-toggle="collapse"][href="#' + i.id + '"],[data-toggle="collapse"][data-target="#' + i.id + '"]');
            this.transitioning = null;
            this.options.parent ? this.$parent = this.getParent() : this.addAriaAndCollapsedClass(this.$element, this.$trigger);
            this.options.toggle && this.toggle()
        },
        u;
    t.VERSION = "3.4.1";
    t.TRANSITION_DURATION = 350;
    t.DEFAULTS = {
        toggle: !0
    };
    t.prototype.dimension = function() {
        var n = this.$element.hasClass("width");
        return n ? "width" : "height"
    };
    t.prototype.show = function() {
        var f, r, e, u, o, s;
        if (!this.transitioning && !this.$element.hasClass("in") && (r = this.$parent && this.$parent.children(".panel").children(".in, .collapsing"), !r || !r.length || (f = r.data("bs.collapse"), !f || !f.transitioning)) && (e = n.Event("show.bs.collapse"), this.$element.trigger(e), !e.isDefaultPrevented())) {
            if (r && r.length && (i.call(r, "hide"), f || r.data("bs.collapse", null)), u = this.dimension(), this.$element.removeClass("collapse").addClass("collapsing")[u](0).attr("aria-expanded", !0), this.$trigger.removeClass("collapsed").attr("aria-expanded", !0), this.transitioning = 1, o = function() {
                    this.$element.removeClass("collapsing").addClass("collapse in")[u]("");
                    this.transitioning = 0;
                    this.$element.trigger("shown.bs.collapse")
                }, !n.support.transition) return o.call(this);
            s = n.camelCase(["scroll", u].join("-"));
            this.$element.one("bsTransitionEnd", n.proxy(o, this)).emulateTransitionEnd(t.TRANSITION_DURATION)[u](this.$element[0][s])
        }
    };
    t.prototype.hide = function() {
        var r, i, u;
        if (!this.transitioning && this.$element.hasClass("in") && (r = n.Event("hide.bs.collapse"), this.$element.trigger(r), !r.isDefaultPrevented())) {
            if (i = this.dimension(), this.$element[i](this.$element[i]())[0].offsetHeight, this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded", !1), this.$trigger.addClass("collapsed").attr("aria-expanded", !1), this.transitioning = 1, u = function() {
                    this.transitioning = 0;
                    this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")
                }, !n.support.transition) return u.call(this);
            this.$element[i](0).one("bsTransitionEnd", n.proxy(u, this)).emulateTransitionEnd(t.TRANSITION_DURATION)
        }
    };
    t.prototype.toggle = function() {
        this[this.$element.hasClass("in") ? "hide" : "show"]()
    };
    t.prototype.getParent = function() {
        return n(document).find(this.options.parent).find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]').each(n.proxy(function(t, i) {
            var u = n(i);
            this.addAriaAndCollapsedClass(r(u), u)
        }, this)).end()
    };
    t.prototype.addAriaAndCollapsedClass = function(n, t) {
        var i = n.hasClass("in");
        n.attr("aria-expanded", i);
        t.toggleClass("collapsed", !i).attr("aria-expanded", i)
    };
    u = n.fn.collapse;
    n.fn.collapse = i;
    n.fn.collapse.Constructor = t;
    n.fn.collapse.noConflict = function() {
        return n.fn.collapse = u, this
    };
    n(document).on("click.bs.collapse.data-api", '[data-toggle="collapse"]', function(t) {
        var u = n(this);
        u.attr("data-target") || t.preventDefault();
        var f = r(u),
            e = f.data("bs.collapse"),
            o = e ? "toggle" : u.data();
        i.call(f, o)
    })
}(jQuery); + function(n) {
    "use strict";

    function t() {
        var i = document.createElement("bootstrap"),
            n = {
                WebkitTransition: "webkitTransitionEnd",
                MozTransition: "transitionend",
                OTransition: "oTransitionEnd otransitionend",
                transition: "transitionend"
            };
        for (var t in n)
            if (i.style[t] !== undefined) return {
                end: n[t]
            };
        return !1
    }
    n.fn.emulateTransitionEnd = function(t) {
        var i = !1,
            u = this,
            r;
        n(this).one("bsTransitionEnd", function() {
            i = !0
        });
        return r = function() {
            i || n(u).trigger(n.support.transition.end)
        }, setTimeout(r, t), this
    };
    n(function() {
        (n.support.transition = t(), n.support.transition) && (n.event.special.bsTransitionEnd = {
            bindType: n.support.transition.end,
            delegateType: n.support.transition.end,
            handle: function(t) {
                if (n(t.target).is(this)) return t.handleObj.handler.apply(this, arguments)
            }
        })
    })
}(jQuery); + function(n) {
    "use strict";

    function t(i, r) {
        this.$body = n(document.body);
        this.$scrollElement = n(i).is(document.body) ? n(window) : n(i);
        this.options = n.extend({}, t.DEFAULTS, r);
        this.selector = (this.options.target || "") + " .nav li > a";
        this.offsets = [];
        this.targets = [];
        this.activeTarget = null;
        this.scrollHeight = 0;
        this.$scrollElement.on("scroll.bs.scrollspy", n.proxy(this.process, this));
        this.refresh();
        this.process()
    }

    function i(i) {
        return this.each(function() {
            var u = n(this),
                r = u.data("bs.scrollspy"),
                f = typeof i == "object" && i;
            r || u.data("bs.scrollspy", r = new t(this, f));
            typeof i == "string" && r[i]()
        })
    }
    t.VERSION = "3.4.1";
    t.DEFAULTS = {
        offset: 10
    };
    t.prototype.getScrollHeight = function() {
        return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
    };
    t.prototype.refresh = function() {
        var t = this,
            i = "offset",
            r = 0;
        this.offsets = [];
        this.targets = [];
        this.scrollHeight = this.getScrollHeight();
        n.isWindow(this.$scrollElement[0]) || (i = "position", r = this.$scrollElement.scrollTop());
        this.$body.find(this.selector).map(function() {
            var f = n(this),
                u = f.data("target") || f.attr("href"),
                t = /^#./.test(u) && n(u);
            return t && t.length && t.is(":visible") && [
                [t[i]().top + r, u]
            ] || null
        }).sort(function(n, t) {
            return n[0] - t[0]
        }).each(function() {
            t.offsets.push(this[0]);
            t.targets.push(this[1])
        })
    };
    t.prototype.process = function() {
        var i = this.$scrollElement.scrollTop() + this.options.offset,
            f = this.getScrollHeight(),
            e = this.options.offset + f - this.$scrollElement.height(),
            t = this.offsets,
            r = this.targets,
            u = this.activeTarget,
            n;
        if (this.scrollHeight != f && this.refresh(), i >= e) return u != (n = r[r.length - 1]) && this.activate(n);
        if (u && i < t[0]) return this.activeTarget = null, this.clear();
        for (n = t.length; n--;) u != r[n] && i >= t[n] && (t[n + 1] === undefined || i < t[n + 1]) && this.activate(r[n])
    };
    t.prototype.activate = function(t) {
        this.activeTarget = t;
        this.clear();
        var r = this.selector + '[data-target="' + t + '"],' + this.selector + '[href="' + t + '"]',
            i = n(r).parents("li").addClass("active");
        i.parent(".dropdown-menu").length && (i = i.closest("li.dropdown").addClass("active"));
        i.trigger("activate.bs.scrollspy")
    };
    t.prototype.clear = function() {
        n(this.selector).parentsUntil(this.options.target, ".active").removeClass("active")
    };
    var r = n.fn.scrollspy;
    n.fn.scrollspy = i;
    n.fn.scrollspy.Constructor = t;
    n.fn.scrollspy.noConflict = function() {
        return n.fn.scrollspy = r, this
    };
    n(window).on("load.bs.scrollspy.data-api", function() {
        n('[data-spy="scroll"]').each(function() {
            var t = n(this);
            i.call(t, t.data())
        })
    })
}(jQuery);
! function(n, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : n.moment = t()
}(this, function() {
    "use strict";

    function t() {
        return kf.apply(null, arguments)
    }

    function rt(n) {
        return n instanceof Array || "[object Array]" === Object.prototype.toString.call(n)
    }

    function ti(n) {
        return null != n && "[object Object]" === Object.prototype.toString.call(n)
    }

    function s(n, t) {
        return Object.prototype.hasOwnProperty.call(n, t)
    }

    function eu(n) {
        if (Object.getOwnPropertyNames) return 0 === Object.getOwnPropertyNames(n).length;
        for (var t in n)
            if (s(n, t)) return;
        return 1
    }

    function k(n) {
        return void 0 === n
    }

    function at(n) {
        return "number" == typeof n || "[object Number]" === Object.prototype.toString.call(n)
    }

    function yi(n) {
        return n instanceof Date || "[object Date]" === Object.prototype.toString.call(n)
    }

    function gf(n, t) {
        for (var r = [], i = 0; i < n.length; ++i) r.push(t(n[i], i));
        return r
    }

    function dt(n, t) {
        for (var i in t) s(t, i) && (n[i] = t[i]);
        return s(t, "toString") && (n.toString = t.toString), s(t, "valueOf") && (n.valueOf = t.valueOf), n
    }

    function ot(n, t, i, r) {
        return io(n, t, i, r, !0).utc()
    }

    function u(n) {
        return null == n._pf && (n._pf = {
            empty: !1,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: !1,
            invalidEra: null,
            invalidMonth: null,
            invalidFormat: !1,
            userInvalidated: !1,
            iso: !1,
            parsedDateParts: [],
            era: null,
            meridiem: null,
            rfc2822: !1,
            weekdayMismatch: !1
        }), n._pf
    }

    function ou(n) {
        if (null == n._isValid) {
            var t = u(n),
                r = df.call(t.parsedDateParts, function(n) {
                    return null != n
                }),
                i = !isNaN(n._d.getTime()) && t.overflow < 0 && !t.empty && !t.invalidEra && !t.invalidMonth && !t.invalidWeekday && !t.weekdayMismatch && !t.nullInput && !t.invalidFormat && !t.userInvalidated && (!t.meridiem || t.meridiem && r);
            if (n._strict && (i = i && 0 === t.charsLeftOver && 0 === t.unusedTokens.length && void 0 === t.bigHour), null != Object.isFrozen && Object.isFrozen(n)) return i;
            n._isValid = i
        }
        return n._isValid
    }

    function ir(n) {
        var t = ot(NaN);
        return null != n ? dt(u(t), n) : u(t).userInvalidated = !0, t
    }

    function su(n, t) {
        var i, r, f;
        if (k(t._isAMomentObject) || (n._isAMomentObject = t._isAMomentObject), k(t._i) || (n._i = t._i), k(t._f) || (n._f = t._f), k(t._l) || (n._l = t._l), k(t._strict) || (n._strict = t._strict), k(t._tzm) || (n._tzm = t._tzm), k(t._isUTC) || (n._isUTC = t._isUTC), k(t._offset) || (n._offset = t._offset), k(t._pf) || (n._pf = u(t)), k(t._locale) || (n._locale = t._locale), 0 < rr.length)
            for (i = 0; i < rr.length; i++) k(f = t[r = rr[i]]) || (n[r] = f);
        return n
    }

    function pi(n) {
        su(this, n);
        this._d = new Date(null != n._d ? n._d.getTime() : NaN);
        this.isValid() || (this._d = new Date(NaN));
        !1 === ur && (ur = !0, t.updateOffset(this), ur = !1)
    }

    function ut(n) {
        return n instanceof pi || null != n && null != n._isAMomentObject
    }

    function ne(n) {
        !1 === t.suppressDeprecationWarnings && "undefined" != typeof console && console.warn && console.warn("Deprecation warning: " + n)
    }

    function nt(n, i) {
        var r = !0;
        return dt(function() {
            if (null != t.deprecationHandler && t.deprecationHandler(null, n), r) {
                for (var u, e, o = [], f = 0; f < arguments.length; f++) {
                    if (u = "", "object" == typeof arguments[f]) {
                        for (e in u += "\n[" + f + "] ", arguments[0]) s(arguments[0], e) && (u += e + ": " + arguments[0][e] + ", ");
                        u = u.slice(0, -2)
                    } else u = arguments[f];
                    o.push(u)
                }
                ne(n + "\nArguments: " + Array.prototype.slice.call(o).join("") + "\n" + (new Error).stack);
                r = !1
            }
            return i.apply(this, arguments)
        }, i)
    }

    function ie(n, i) {
        null != t.deprecationHandler && t.deprecationHandler(n, i);
        hu[n] || (ne(i), hu[n] = !0)
    }

    function st(n) {
        return "undefined" != typeof Function && n instanceof Function || "[object Function]" === Object.prototype.toString.call(n)
    }

    function cu(n, t) {
        var i, r = dt({}, n);
        for (i in t) s(t, i) && (ti(n[i]) && ti(t[i]) ? (r[i] = {}, dt(r[i], n[i]), dt(r[i], t[i])) : null != t[i] ? r[i] = t[i] : delete r[i]);
        for (i in n) s(n, i) && !s(t, i) && ti(n[i]) && (r[i] = dt({}, r[i]));
        return r
    }

    function lu(n) {
        null != n && this.set(n)
    }

    function ht(n, t, i) {
        var r = "" + Math.abs(n),
            u = t - r.length;
        return (0 <= n ? i ? "+" : "" : "-") + Math.pow(10, Math.max(0, u)).toString().substr(1) + r
    }

    function r(n, t, i, r) {
        var u = "string" == typeof r ? function() {
            return this[r]()
        } : r;
        n && (fi[n] = u);
        t && (fi[t[0]] = function() {
            return ht(u.apply(this, arguments), t[1], t[2])
        });
        i && (fi[i] = function() {
            return this.localeData().ordinal(u.apply(this, arguments), n)
        })
    }

    function er(n, t) {
        return n.isValid() ? (t = re(t, n.localeData()), vu[t] = vu[t] || function(n) {
            for (var r, t = n.match(au), i = 0, u = t.length; i < u; i++) t[i] = fi[t[i]] ? fi[t[i]] : (r = t[i]).match(/\[[\s\S]/) ? r.replace(/^\[|\]$/g, "") : r.replace(/\\/g, "");
            return function(i) {
                for (var f = "", r = 0; r < u; r++) f += st(t[r]) ? t[r].call(i, n) : t[r];
                return f
            }
        }(t), vu[t](n)) : n.localeData().invalidDate()
    }

    function re(n, t) {
        function r(n) {
            return t.longDateFormat(n) || n
        }
        var i = 5;
        for (fr.lastIndex = 0; 0 <= i && fr.test(n);) n = n.replace(fr, r), fr.lastIndex = 0, --i;
        return n
    }

    function p(n, t) {
        var i = n.toLowerCase();
        ei[i] = ei[i + "s"] = ei[t] = n
    }

    function tt(n) {
        if ("string" == typeof n) return ei[n] || ei[n.toLowerCase()]
    }

    function yu(n) {
        var i, t, r = {};
        for (t in n) s(n, t) && (i = tt(t)) && (r[i] = n[t]);
        return r
    }

    function w(n, t) {
        pu[n] = t
    }

    function or(n) {
        return n % 4 == 0 && n % 100 != 0 || n % 400 == 0
    }

    function it(n) {
        return n < 0 ? Math.ceil(n) || 0 : Math.floor(n)
    }

    function f(n) {
        var t = +n,
            i = 0;
        return 0 != t && isFinite(t) && (i = it(t)), i
    }

    function oi(n, i) {
        return function(r) {
            return null != r ? (ue(this, n, r), t.updateOffset(this, i), this) : sr(this, n)
        }
    }

    function sr(n, t) {
        return n.isValid() ? n._d["get" + (n._isUTC ? "UTC" : "") + t]() : NaN
    }

    function ue(n, t, i) {
        n.isValid() && !isNaN(i) && ("FullYear" === t && or(n.year()) && 1 === n.month() && 29 === n.date() ? (i = f(i), n._d["set" + (n._isUTC ? "UTC" : "") + t](i, n.month(), wr(i, n.month()))) : n._d["set" + (n._isUTC ? "UTC" : "") + t](i))
    }

    function i(n, t, i) {
        hr[n] = st(t) ? t : function(n) {
            return n && i ? i : t
        }
    }

    function ls(n, t) {
        return s(hr, n) ? hr[n](t._strict, t._locale) : new RegExp(g(n.replace("\\", "").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function(n, t, i, r, u) {
            return t || i || r || u
        })))
    }

    function g(n) {
        return n.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
    }

    function h(n, t) {
        var i, r = t;
        for ("string" == typeof n && (n = [n]), at(t) && (r = function(n, i) {
                i[t] = f(n)
            }), i = 0; i < n.length; i++) pr[n[i]] = r
    }

    function bi(n, t) {
        h(n, function(n, i, r, u) {
            r._w = r._w || {};
            t(n, r._w, r, u)
        })
    }

    function wr(n, t) {
        if (isNaN(n) || isNaN(t)) return NaN;
        var i, r = (t % (i = 12) + i) % i;
        return n += (t - r) / 12, 1 == r ? or(n) ? 29 : 28 : 31 - r % 7 % 2
    }

    function le(n, t) {
        var i;
        if (!n.isValid()) return n;
        if ("string" == typeof t)
            if (/^\d+$/.test(t)) t = f(t);
            else if (!at(t = n.localeData().monthsParse(t))) return n;
        return i = Math.min(n.date(), wr(n.year(), t)), n._d["set" + (n._isUTC ? "UTC" : "") + "Month"](t, i), n
    }

    function ae(n) {
        return null != n ? (le(this, n), t.updateOffset(this, !0), this) : sr(this, "Month")
    }

    function ve() {
        function f(n, t) {
            return t.length - n.length
        }
        for (var i, r = [], u = [], t = [], n = 0; n < 12; n++) i = ot([2e3, n]), r.push(this.monthsShort(i, "")), u.push(this.months(i, "")), t.push(this.months(i, "")), t.push(this.monthsShort(i, ""));
        for (r.sort(f), u.sort(f), t.sort(f), n = 0; n < 12; n++) r[n] = g(r[n]), u[n] = g(u[n]);
        for (n = 0; n < 24; n++) t[n] = g(t[n]);
        this._monthsRegex = new RegExp("^(" + t.join("|") + ")", "i");
        this._monthsShortRegex = this._monthsRegex;
        this._monthsStrictRegex = new RegExp("^(" + u.join("|") + ")", "i");
        this._monthsShortStrictRegex = new RegExp("^(" + r.join("|") + ")", "i")
    }

    function ki(n) {
        return or(n) ? 366 : 365
    }

    function di(n) {
        var t, i;
        return n < 100 && 0 <= n ? ((i = Array.prototype.slice.call(arguments))[0] = n + 400, t = new Date(Date.UTC.apply(null, i)), isFinite(t.getUTCFullYear()) && t.setUTCFullYear(n)) : t = new Date(Date.UTC.apply(null, arguments)), t
    }

    function br(n, t, i) {
        var r = 7 + t - i;
        return r - (7 + di(n, 0, r).getUTCDay() - t) % 7 - 1
    }

    function ye(n, t, i, r, u) {
        var e, f = 1 + 7 * (t - 1) + (7 + i - r) % 7 + br(n, r, u),
            o = f <= 0 ? ki(e = n - 1) + f : f > ki(n) ? (e = n + 1, f - ki(n)) : (e = n, f);
        return {
            year: e,
            dayOfYear: o
        }
    }

    function gi(n, t, i) {
        var u, f, e = br(n.year(), t, i),
            r = Math.floor((n.dayOfYear() - e - 1) / 7) + 1;
        return r < 1 ? u = r + pt(f = n.year() - 1, t, i) : r > pt(n.year(), t, i) ? (u = r - pt(n.year(), t, i), f = n.year() + 1) : (f = n.year(), u = r), {
            week: u,
            year: f
        }
    }

    function pt(n, t, i) {
        var r = br(n, t, i),
            u = br(n + 1, t, i);
        return (ki(n) - r + u) / 7
    }

    function du(n, t) {
        return n.slice(t, 7).concat(n.slice(0, t))
    }

    function gu() {
        function t(n, t) {
            return t.length - n.length
        }
        for (var i, r, u, f, e = [], o = [], s = [], n = [], h = 0; h < 7; h++) i = ot([2e3, 1]).day(h), r = g(this.weekdaysMin(i, "")), u = g(this.weekdaysShort(i, "")), f = g(this.weekdays(i, "")), e.push(r), o.push(u), s.push(f), n.push(r), n.push(u), n.push(f);
        e.sort(t);
        o.sort(t);
        s.sort(t);
        n.sort(t);
        this._weekdaysRegex = new RegExp("^(" + n.join("|") + ")", "i");
        this._weekdaysShortRegex = this._weekdaysRegex;
        this._weekdaysMinRegex = this._weekdaysRegex;
        this._weekdaysStrictRegex = new RegExp("^(" + s.join("|") + ")", "i");
        this._weekdaysShortStrictRegex = new RegExp("^(" + o.join("|") + ")", "i");
        this._weekdaysMinStrictRegex = new RegExp("^(" + e.join("|") + ")", "i")
    }

    function nf() {
        return this.hours() % 12 || 12
    }

    function we(n, t) {
        r(n, 0, 0, function() {
            return this.localeData().meridiem(this.hours(), this.minutes(), t)
        })
    }

    function be(n, t) {
        return t._meridiemParse
    }

    function de(n) {
        return n ? n.toLowerCase().replace("_", "-") : n
    }

    function ih(n) {
        for (var t, i, f, u, r = 0; r < n.length;) {
            for (t = (u = de(n[r]).split("-")).length, i = (i = de(n[r + 1])) ? i.split("-") : null; 0 < t;) {
                if (f = kr(u.slice(0, t).join("-"))) return f;
                if (i && i.length >= t && function(n, t) {
                        for (var r = Math.min(n.length, t.length), i = 0; i < r; i += 1)
                            if (n[i] !== t[i]) return i;
                        return r
                    }(u, i) >= t - 1) break;
                t--
            }
            r++
        }
        return nr
    }

    function kr(n) {
        var t;
        if (void 0 === a[n] && "undefined" != typeof module && module && module.exports) try {
            t = nr._abbr;
            require("./locale/" + n);
            gt(t)
        } catch (t) {
            a[n] = null
        }
        return a[n]
    }

    function gt(n, t) {
        var i;
        return n && ((i = k(t) ? wt(n) : tf(n, t)) ? nr = i : "undefined" != typeof console && console.warn && console.warn("Locale " + n + " not found. Did you forget to load it?")), nr._abbr
    }

    function tf(n, t) {
        if (null === t) return delete a[n], null;
        var r, i = ke;
        if (t.abbr = n, null != a[n]) ie("defineLocaleOverride", "use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info."), i = a[n]._config;
        else if (null != t.parentLocale)
            if (null != a[t.parentLocale]) i = a[t.parentLocale]._config;
            else {
                if (null == (r = kr(t.parentLocale))) return tr[t.parentLocale] || (tr[t.parentLocale] = []), tr[t.parentLocale].push({
                    name: n,
                    config: t
                }), null;
                i = r._config
            } return a[n] = new lu(cu(i, t)), tr[n] && tr[n].forEach(function(n) {
            tf(n.name, n.config)
        }), gt(n), a[n]
    }

    function wt(n) {
        var t;
        if (n && n._locale && n._locale._abbr && (n = n._locale._abbr), !n) return nr;
        if (!rt(n)) {
            if (t = kr(n)) return t;
            n = [n]
        }
        return ih(n)
    }

    function rf(n) {
        var i, t = n._a;
        return t && -2 === u(n).overflow && (i = t[vt] < 0 || 11 < t[vt] ? vt : t[ct] < 1 || t[ct] > wr(t[b], t[vt]) ? ct : t[y] < 0 || 24 < t[y] || 24 === t[y] && (0 !== t[ft] || 0 !== t[yt] || 0 !== t[ii]) ? y : t[ft] < 0 || 59 < t[ft] ? ft : t[yt] < 0 || 59 < t[yt] ? yt : t[ii] < 0 || 999 < t[ii] ? ii : -1, u(n)._overflowDayOfYear && (i < b || ct < i) && (i = ct), u(n)._overflowWeeks && -1 === i && (i = as), u(n)._overflowWeekday && -1 === i && (i = vs), u(n).overflow = i), n
    }

    function ge(n) {
        var t, r, o, e, f, s, h = n._i,
            i = rh.exec(h) || uh.exec(h);
        if (i) {
            for (u(n).iso = !0, t = 0, r = dr.length; t < r; t++)
                if (dr[t][1].exec(i[1])) {
                    e = dr[t][0];
                    o = !1 !== dr[t][2];
                    break
                } if (null == e) return void(n._isValid = !1);
            if (i[3]) {
                for (t = 0, r = uf.length; t < r; t++)
                    if (uf[t][1].exec(i[3])) {
                        f = (i[2] || " ") + uf[t][0];
                        break
                    } if (null == f) return void(n._isValid = !1)
            }
            if (!o && null != f) return void(n._isValid = !1);
            if (i[4]) {
                if (!fh.exec(i[4])) return void(n._isValid = !1);
                s = "Z"
            }
            n._f = e + (f || "") + (s || "");
            ef(n)
        } else n._isValid = !1
    }

    function hh(n, t, i, r, u, f) {
        var e = [function(n) {
            var t = parseInt(n, 10);
            return t <= 49 ? 2e3 + t : t <= 999 ? 1900 + t : t
        }(n), he.indexOf(t), parseInt(i, 10), parseInt(r, 10), parseInt(u, 10)];
        return f && e.push(parseInt(f, 10)), e
    }

    function no(n) {
        var r, f, i, e, t = oh.exec(n._i.replace(/\([^)]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").replace(/^\s\s*/, "").replace(/\s\s*$/, ""));
        if (t) {
            if (r = hh(t[4], t[3], t[2], t[5], t[6], t[7]), f = t[1], i = r, e = n, f && pe.indexOf(f) !== new Date(i[0], i[1], i[2]).getDay() && (u(e).weekdayMismatch = !0, !void(e._isValid = !1))) return;
            n._a = r;
            n._tzm = function(n, t, i) {
                if (n) return sh[n];
                if (t) return 0;
                var r = parseInt(i, 10),
                    u = r % 100;
                return 60 * ((r - u) / 100) + u
            }(t[8], t[9], t[10]);
            n._d = di.apply(null, n._a);
            n._d.setUTCMinutes(n._d.getUTCMinutes() - n._tzm);
            u(n).rfc2822 = !0
        } else n._isValid = !1
    }

    function hi(n, t, i) {
        return null != n ? n : null != t ? t : i
    }

    function ff(n) {
        var i, f, e, h, o, c, r, s = [];
        if (!n._d) {
            for (c = n, r = new Date(t.now()), e = c._useUTC ? [r.getUTCFullYear(), r.getUTCMonth(), r.getUTCDate()] : [r.getFullYear(), r.getMonth(), r.getDate()], n._w && null == n._a[ct] && null == n._a[vt] && function(n) {
                    var t, o, f, i, r, e, h, s, c;
                    null != (t = n._w).GG || null != t.W || null != t.E ? (r = 1, e = 4, o = hi(t.GG, n._a[b], gi(l(), 1, 4).year), f = hi(t.W, 1), ((i = hi(t.E, 1)) < 1 || 7 < i) && (s = !0)) : (r = n._locale._week.dow, e = n._locale._week.doy, c = gi(l(), r, e), o = hi(t.gg, n._a[b], c.year), f = hi(t.w, c.week), null != t.d ? ((i = t.d) < 0 || 6 < i) && (s = !0) : null != t.e ? (i = t.e + r, (t.e < 0 || 6 < t.e) && (s = !0)) : i = r);
                    f < 1 || f > pt(o, r, e) ? u(n)._overflowWeeks = !0 : null != s ? u(n)._overflowWeekday = !0 : (h = ye(o, f, i, r, e), n._a[b] = h.year, n._dayOfYear = h.dayOfYear)
                }(n), null != n._dayOfYear && (o = hi(n._a[b], e[b]), (n._dayOfYear > ki(o) || 0 === n._dayOfYear) && (u(n)._overflowDayOfYear = !0), f = di(o, 0, n._dayOfYear), n._a[vt] = f.getUTCMonth(), n._a[ct] = f.getUTCDate()), i = 0; i < 3 && null == n._a[i]; ++i) n._a[i] = s[i] = e[i];
            for (; i < 7; i++) n._a[i] = s[i] = null == n._a[i] ? 2 === i ? 1 : 0 : n._a[i];
            24 === n._a[y] && 0 === n._a[ft] && 0 === n._a[yt] && 0 === n._a[ii] && (n._nextDay = !0, n._a[y] = 0);
            n._d = (n._useUTC ? di : function(n, t, i, r, u, f, e) {
                var o;
                return n < 100 && 0 <= n ? (o = new Date(n + 400, t, i, r, u, f, e), isFinite(o.getFullYear()) && o.setFullYear(n)) : o = new Date(n, t, i, r, u, f, e), o
            }).apply(null, s);
            h = n._useUTC ? n._d.getUTCDay() : n._d.getDay();
            null != n._tzm && n._d.setUTCMinutes(n._d.getUTCMinutes() - n._tzm);
            n._nextDay && (n._a[y] = 24);
            n._w && void 0 !== n._w.d && n._w.d !== h && (u(n).weekdayMismatch = !0)
        }
    }

    function ef(n) {
        if (n._f !== t.ISO_8601)
            if (n._f !== t.RFC_2822) {
                n._a = [];
                u(n).empty = !0;
                for (var r, f, c, l, e, a, o, i = "" + n._i, w = i.length, v = 0, p = re(n._f, n._locale).match(au) || [], h = 0; h < p.length; h++) f = p[h], (r = (i.match(ls(f, n)) || [])[0]) && (0 < (c = i.substr(0, i.indexOf(r))).length && u(n).unusedInput.push(c), i = i.slice(i.indexOf(r) + r.length), v += r.length), fi[f] ? (r ? u(n).empty = !1 : u(n).unusedTokens.push(f), e = f, o = n, null != (a = r) && s(pr, e) && pr[e](a, o._a, o, e)) : n._strict && !r && u(n).unusedTokens.push(f);
                u(n).charsLeftOver = w - v;
                0 < i.length && u(n).unusedInput.push(i);
                n._a[y] <= 12 && !0 === u(n).bigHour && 0 < n._a[y] && (u(n).bigHour = void 0);
                u(n).parsedDateParts = n._a.slice(0);
                u(n).meridiem = n._meridiem;
                n._a[y] = function(n, t, i) {
                    var r;
                    return null == i ? t : null != n.meridiemHour ? n.meridiemHour(t, i) : (null != n.isPM && ((r = n.isPM(i)) && t < 12 && (t += 12), r || 12 !== t || (t = 0)), t)
                }(n._locale, n._a[y], n._meridiem);
                null !== (l = u(n).era) && (n._a[b] = n._locale.erasConvertYear(l, n._a[b]));
                ff(n);
                rf(n)
            } else no(n);
        else ge(n)
    }

    function to(n) {
        var i, r, f = n._i,
            e = n._f;
        return n._locale = n._locale || wt(n._l), null === f || void 0 === e && "" === f ? ir({
            nullInput: !0
        }) : ("string" == typeof f && (n._i = f = n._locale.preparse(f)), ut(f) ? new pi(rf(f)) : (yi(f) ? n._d = f : rt(e) ? function(n) {
            var t, o, r, f, i, e, s = !1;
            if (0 === n._f.length) return u(n).invalidFormat = !0, n._d = new Date(NaN);
            for (f = 0; f < n._f.length; f++) i = 0, e = !1, t = su({}, n), null != n._useUTC && (t._useUTC = n._useUTC), t._f = n._f[f], ef(t), ou(t) && (e = !0), i += u(t).charsLeftOver, i += 10 * u(t).unusedTokens.length, u(t).score = i, s ? i < r && (r = i, o = t) : (null == r || i < r || e) && (r = i, o = t, e && (s = !0));
            dt(n, o || t)
        }(n) : e ? ef(n) : k(r = (i = n)._i) ? i._d = new Date(t.now()) : yi(r) ? i._d = new Date(r.valueOf()) : "string" == typeof r ? function(n) {
            var i = eh.exec(n._i);
            null === i ? (ge(n), !1 === n._isValid && (delete n._isValid, no(n), !1 === n._isValid && (delete n._isValid, n._strict ? n._isValid = !1 : t.createFromInputFallback(n)))) : n._d = new Date(+i[1])
        }(i) : rt(r) ? (i._a = gf(r.slice(0), function(n) {
            return parseInt(n, 10)
        }), ff(i)) : ti(r) ? function(n) {
            var t, i;
            n._d || (i = void 0 === (t = yu(n._i)).day ? t.date : t.day, n._a = gf([t.year, t.month, i, t.hour, t.minute, t.second, t.millisecond], function(n) {
                return n && parseInt(n, 10)
            }), ff(n))
        }(i) : at(r) ? i._d = new Date(r) : t.createFromInputFallback(i), ou(n) || (n._d = null), n))
    }

    function io(n, t, i, r, u) {
        var e, f = {};
        return !0 !== t && !1 !== t || (r = t, t = void 0), !0 !== i && !1 !== i || (r = i, i = void 0), (ti(n) && eu(n) || rt(n) && 0 === n.length) && (n = void 0), f._isAMomentObject = !0, f._useUTC = f._isUTC = u, f._l = i, f._i = n, f._f = t, f._strict = r, (e = new pi(rf(to(f))))._nextDay && (e.add(1, "d"), e._nextDay = void 0), e
    }

    function l(n, t, i, r) {
        return io(n, t, i, r, !1)
    }

    function fo(n, t) {
        var r, i;
        if (1 === t.length && rt(t[0]) && (t = t[0]), !t.length) return l();
        for (r = t[0], i = 1; i < t.length; ++i) t[i].isValid() && !t[i][n](r) || (r = t[i]);
        return r
    }

    function gr(n) {
        var t = yu(n),
            i = t.year || 0,
            r = t.quarter || 0,
            u = t.month || 0,
            e = t.week || t.isoWeek || 0,
            o = t.day || 0,
            h = t.hour || 0,
            c = t.minute || 0,
            l = t.second || 0,
            a = t.millisecond || 0;
        this._isValid = function(n) {
            var i, t, r = !1;
            for (i in n)
                if (s(n, i) && (-1 === v.call(ci, i) || null != n[i] && isNaN(n[i]))) return !1;
            for (t = 0; t < ci.length; ++t)
                if (n[ci[t]]) {
                    if (r) return !1;
                    parseFloat(n[ci[t]]) !== f(n[ci[t]]) && (r = !0)
                } return !0
        }(t);
        this._milliseconds = +a + 1e3 * l + 6e4 * c + 36e5 * h;
        this._days = +o + 7 * e;
        this._months = +u + 3 * r + 12 * i;
        this._data = {};
        this._locale = wt();
        this._bubble()
    }

    function nu(n) {
        return n instanceof gr
    }

    function of (n) {
        return n < 0 ? -1 * Math.round(-1 * n) : Math.round(n)
    }

    function eo(n, t) {
        r(n, 0, 0, function() {
            var n = this.utcOffset(),
                i = "+";
            return n < 0 && (n = -n, i = "-"), i + ht(~~(n / 60), 2) + t + ht(~~n % 60, 2)
        })
    }

    function sf(n, t) {
        var i, r, u = (t || "").match(n);
        return null === u ? null : 0 === (r = 60 * (i = ((u[u.length - 1] || []) + "").match(oo) || ["-", 0, 0])[1] + f(i[2])) ? 0 : "+" === i[0] ? r : -r
    }

    function hf(n, i) {
        var r, u;
        return i._isUTC ? (r = i.clone(), u = (ut(n) || yi(n) ? n.valueOf() : l(n).valueOf()) - r.valueOf(), r._d.setTime(r._d.valueOf() + u), t.updateOffset(r, !1), r) : l(n).local()
    }

    function cf(n) {
        return -Math.round(n._d.getTimezoneOffset())
    }

    function so() {
        return !!this.isValid() && this._isUTC && 0 === this._offset
    }

    function et(n, t) {
        var u, e, o, i = n,
            r = null;
        return nu(n) ? i = {
            ms: n._milliseconds,
            d: n._days,
            M: n._months
        } : at(n) || !isNaN(+n) ? (i = {}, t ? i[t] = +n : i.milliseconds = +n) : (r = ho.exec(n)) ? (u = "-" === r[1] ? -1 : 1, i = {
            y: 0,
            d: f(r[ct]) * u,
            h: f(r[y]) * u,
            m: f(r[ft]) * u,
            s: f(r[yt]) * u,
            ms: f( of (1e3 * r[ii])) * u
        }) : (r = co.exec(n)) ? (u = "-" === r[1] ? -1 : 1, i = {
            y: ri(r[2], u),
            M: ri(r[3], u),
            w: ri(r[4], u),
            d: ri(r[5], u),
            h: ri(r[6], u),
            m: ri(r[7], u),
            s: ri(r[8], u)
        }) : null == i ? i = {} : "object" == typeof i && ("from" in i || "to" in i) && (o = function(n, t) {
            var i;
            return !n.isValid() || !t.isValid() ? {
                milliseconds: 0,
                months: 0
            } : (t = hf(t, n), n.isBefore(t) ? i = lo(n, t) : ((i = lo(t, n)).milliseconds = -i.milliseconds, i.months = -i.months), i)
        }(l(i.from), l(i.to)), (i = {}).ms = o.milliseconds, i.M = o.months), e = new gr(i), nu(n) && s(n, "_locale") && (e._locale = n._locale), nu(n) && s(n, "_isValid") && (e._isValid = n._isValid), e
    }

    function ri(n, t) {
        var i = n && parseFloat(n.replace(",", "."));
        return (isNaN(i) ? 0 : i) * t
    }

    function lo(n, t) {
        var i = {};
        return i.months = t.month() - n.month() + 12 * (t.year() - n.year()), n.clone().add(i.months, "M").isAfter(t) && --i.months, i.milliseconds = t - n.clone().add(i.months, "M"), i
    }

    function ao(n, t) {
        return function(i, r) {
            var u;
            return null === r || isNaN(+r) || (ie(t, "moment()." + t + "(period, number) is deprecated. Please use moment()." + t + "(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info."), u = i, i = r, r = u), vo(this, et(i, r), n), this
        }
    }

    function vo(n, i, r, u) {
        var o = i._milliseconds,
            f = of (i._days),
            e = of (i._months);
        n.isValid() && (u = null == u || u, e && le(n, sr(n, "Month") + e * r), f && ue(n, "Date", sr(n, "Date") + f * r), o && n._d.setTime(n._d.valueOf() + o * r), u && t.updateOffset(n, f || e))
    }

    function wo(n) {
        return "string" == typeof n || n instanceof String
    }

    function ch(n) {
        return ut(n) || yi(n) || wo(n) || at(n) || function(n) {
            var t = rt(n),
                i = !1;
            return t && (i = 0 === n.filter(function(t) {
                return !at(t) && wo(n)
            }).length), t && i
        }(n) || function(n) {
            for (var r, f = ti(n) && !eu(n), i = !1, u = ["years", "year", "y", "months", "month", "M", "days", "day", "d", "dates", "date", "D", "hours", "hour", "h", "minutes", "minute", "m", "seconds", "second", "s", "milliseconds", "millisecond", "ms"], t = 0; t < u.length; t += 1) r = u[t], i = i || s(n, r);
            return f && i
        }(n) || null == n
    }

    function tu(n, t) {
        if (n.date() < t.date()) return -tu(t, n);
        var r = 12 * (t.year() - n.year()) + (t.month() - n.month()),
            i = n.clone().add(r, "months"),
            u = t - i < 0 ? (t - i) / (i - n.clone().add(r - 1, "months")) : (t - i) / (n.clone().add(1 + r, "months") - i);
        return -(r + u) || 0
    }

    function bo(n) {
        var t;
        return void 0 === n ? this._locale._abbr : (null != (t = wt(n)) && (this._locale = t), this)
    }

    function ko() {
        return this._locale
    }

    function li(n, t) {
        return (n % t + t) % t
    }

    function go(n, t, i) {
        return n < 100 && 0 <= n ? new Date(n + 400, t, i) - af : new Date(n, t, i).valueOf()
    }

    function ns(n, t, i) {
        return n < 100 && 0 <= n ? Date.UTC(n + 400, t, i) - af : Date.UTC(n, t, i)
    }

    function vf(n, t) {
        return t.erasAbbrRegex(n)
    }

    function yf() {
        for (var r = [], u = [], f = [], i = [], t = this.eras(), n = 0, e = t.length; n < e; ++n) u.push(g(t[n].name)), r.push(g(t[n].abbr)), f.push(g(t[n].narrow)), i.push(g(t[n].name)), i.push(g(t[n].abbr)), i.push(g(t[n].narrow));
        this._erasRegex = new RegExp("^(" + i.join("|") + ")", "i");
        this._erasNameRegex = new RegExp("^(" + u.join("|") + ")", "i");
        this._erasAbbrRegex = new RegExp("^(" + r.join("|") + ")", "i");
        this._erasNarrowRegex = new RegExp("^(" + f.join("|") + ")", "i")
    }

    function iu(n, t) {
        r(0, [n, n.length], 0, t)
    }

    function ts(n, t, i, r, u) {
        var f;
        return null == n ? gi(this, r, u).year : ((f = pt(n, r, u)) < t && (t = f), function(n, t, i, r, u) {
            var e = ye(n, t, i, r, u),
                f = di(e.year, 0, e.dayOfYear);
            return this.year(f.getUTCFullYear()), this.month(f.getUTCMonth()), this.date(f.getUTCDate()), this
        }.call(this, n, t, i, r, u))
    }

    function lh(n, t) {
        t[ii] = f(1e3 * ("0." + n))
    }

    function fs(n) {
        return n
    }

    function ru(n, t, i, r) {
        var u = wt(),
            f = ot().set(r, t);
        return u[i](f, n)
    }

    function es(n, t, i) {
        if (at(n) && (t = n, n = void 0), n = n || "", null != t) return ru(n, t, i, "month");
        for (var u = [], r = 0; r < 12; r++) u[r] = ru(n, r, i, "month");
        return u
    }

    function wf(n, t, i, r) {
        t = ("boolean" == typeof n ? at(t) && (i = t, t = void 0) : (t = n, n = !1, at(i = t) && (i = t, t = void 0)), t || "");
        var u, o = wt(),
            f = n ? o._week.dow : 0,
            e = [];
        if (null != i) return ru(t, (i + f) % 7, r, "day");
        for (u = 0; u < 7; u++) e[u] = ru(t, (u + f) % 7, r, "day");
        return e
    }

    function os(n, t, i, r) {
        var u = et(t, i);
        return n._milliseconds += r * u._milliseconds, n._days += r * u._days, n._months += r * u._months, n._bubble()
    }

    function ss(n) {
        return n < 0 ? Math.floor(n) : Math.ceil(n)
    }

    function hs(n) {
        return 4800 * n / 146097
    }

    function bf(n) {
        return 146097 * n / 4800
    }

    function bt(n) {
        return function() {
            return this.as(n)
        }
    }

    function ui(n) {
        return function() {
            return this.isValid() ? this._data[n] : NaN
        }
    }

    function oc(n, t, i, r) {
        var u = et(n).abs(),
            e = kt(u.as("s")),
            o = kt(u.as("m")),
            s = kt(u.as("h")),
            h = kt(u.as("d")),
            c = kt(u.as("M")),
            l = kt(u.as("w")),
            a = kt(u.as("y")),
            f = (e <= i.ss ? ["s", e] : e < i.s && ["ss", e]) || o <= 1 && ["m"] || o < i.m && ["mm", o] || s <= 1 && ["h"] || s < i.h && ["hh", s] || h <= 1 && ["d"] || h < i.d && ["dd", h];
        return null != i.w && (f = f || l <= 1 && ["w"] || l < i.w && ["ww", l]), (f = f || c <= 1 && ["M"] || c < i.M && ["MM", c] || a <= 1 && ["y"] || ["yy", a])[2] = t, f[3] = 0 < +n, f[4] = r,
            function(n, t, i, r, u) {
                return u.relativeTime(t || 1, !!i, n, r)
            }.apply(null, f)
    }

    function vi(n) {
        return (0 < n) - (n < 0) || +n
    }

    function fu() {
        if (!this.isValid()) return this.localeData().invalidDate();
        var n, r, e, s, h, o, c, u, t = uu(this._milliseconds) / 1e3,
            l = uu(this._days),
            f = uu(this._months),
            i = this.asSeconds();
        return i ? (n = it(t / 60), r = it(n / 60), t %= 60, n %= 60, e = it(f / 12), f %= 12, s = t ? t.toFixed(3).replace(/\.?0+$/, "") : "", h = i < 0 ? "-" : "", o = vi(this._months) !== vi(i) ? "-" : "", c = vi(this._days) !== vi(i) ? "-" : "", u = vi(this._milliseconds) !== vi(i) ? "-" : "", h + "P" + (e ? o + e + "Y" : "") + (f ? o + f + "M" : "") + (l ? c + l + "D" : "") + (r || n || t ? "T" : "") + (r ? u + r + "H" : "") + (n ? u + n + "M" : "") + (t ? u + s + "S" : "")) : "P0D"
    }
    var kf, df, rr, ur, te, hu, ei, pu, pr, ku, ro, uo, ci, oo, ho, co, yo, po, lf, af, pf, is, ni, rs, us, n, o, lt, uu, e;
    df = Array.prototype.some ? Array.prototype.some : function(n) {
        for (var i = Object(this), r = i.length >>> 0, t = 0; t < r; t++)
            if (t in i && n.call(this, i[t], t, i)) return !0;
        return !1
    };
    rr = t.momentProperties = [];
    ur = !1;
    hu = {};
    t.suppressDeprecationWarnings = !1;
    t.deprecationHandler = null;
    te = Object.keys ? Object.keys : function(n) {
        var t, i = [];
        for (t in n) s(n, t) && i.push(t);
        return i
    };
    var au = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|N{1,5}|YYYYYY|YYYYY|YYYY|YY|y{2,4}|yo?|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
        fr = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g,
        vu = {},
        fi = {};
    ei = {};
    pu = {};
    var hr, fe = /\d/,
        d = /\d\d/,
        ee = /\d{3}/,
        wu = /\d{4}/,
        cr = /[+-]?\d{6}/,
        c = /\d\d?/,
        oe = /\d\d\d\d?/,
        se = /\d\d\d\d\d\d?/,
        lr = /\d{1,3}/,
        bu = /\d{1,4}/,
        ar = /[+-]?\d{1,6}/,
        si = /\d+/,
        vr = /[+-]?\d+/,
        cs = /Z|[+-]\d\d:?\d\d/gi,
        yr = /Z|[+-]\d\d(?::?\d\d)?/gi,
        wi = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i;
    hr = {};
    pr = {};
    var v, b = 0,
        vt = 1,
        ct = 2,
        y = 3,
        ft = 4,
        yt = 5,
        ii = 6,
        as = 7,
        vs = 8;
    v = Array.prototype.indexOf ? Array.prototype.indexOf : function(n) {
        for (var t = 0; t < this.length; ++t)
            if (this[t] === n) return t;
        return -1
    };
    r("M", ["MM", 2], "Mo", function() {
        return this.month() + 1
    });
    r("MMM", 0, 0, function(n) {
        return this.localeData().monthsShort(this, n)
    });
    r("MMMM", 0, 0, function(n) {
        return this.localeData().months(this, n)
    });
    p("month", "M");
    w("month", 8);
    i("M", c);
    i("MM", c, d);
    i("MMM", function(n, t) {
        return t.monthsShortRegex(n)
    });
    i("MMMM", function(n, t) {
        return t.monthsRegex(n)
    });
    h(["M", "MM"], function(n, t) {
        t[vt] = f(n) - 1
    });
    h(["MMM", "MMMM"], function(n, t, i, r) {
        var f = i._locale.monthsParse(n, r, i._strict);
        null != f ? t[vt] = f : u(i).invalidMonth = n
    });
    var ys = "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
        he = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
        ce = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/,
        ps = wi,
        ws = wi;
    r("Y", 0, 0, function() {
        var n = this.year();
        return n <= 9999 ? ht(n, 4) : "+" + n
    });
    r(0, ["YY", 2], 0, function() {
        return this.year() % 100
    });
    r(0, ["YYYY", 4], 0, "year");
    r(0, ["YYYYY", 5], 0, "year");
    r(0, ["YYYYYY", 6, !0], 0, "year");
    p("year", "y");
    w("year", 1);
    i("Y", vr);
    i("YY", c, d);
    i("YYYY", bu, wu);
    i("YYYYY", ar, cr);
    i("YYYYYY", ar, cr);
    h(["YYYYY", "YYYYYY"], b);
    h("YYYY", function(n, i) {
        i[b] = 2 === n.length ? t.parseTwoDigitYear(n) : f(n)
    });
    h("YY", function(n, i) {
        i[b] = t.parseTwoDigitYear(n)
    });
    h("Y", function(n, t) {
        t[b] = parseInt(n, 10)
    });
    t.parseTwoDigitYear = function(n) {
        return f(n) + (68 < f(n) ? 1900 : 2e3)
    };
    ku = oi("FullYear", !0);
    r("w", ["ww", 2], "wo", "week");
    r("W", ["WW", 2], "Wo", "isoWeek");
    p("week", "w");
    p("isoWeek", "W");
    w("week", 5);
    w("isoWeek", 5);
    i("w", c);
    i("ww", c, d);
    i("W", c);
    i("WW", c, d);
    bi(["w", "ww", "W", "WW"], function(n, t, i, r) {
        t[r.substr(0, 1)] = f(n)
    });
    r("d", 0, "do", "day");
    r("dd", 0, 0, function(n) {
        return this.localeData().weekdaysMin(this, n)
    });
    r("ddd", 0, 0, function(n) {
        return this.localeData().weekdaysShort(this, n)
    });
    r("dddd", 0, 0, function(n) {
        return this.localeData().weekdays(this, n)
    });
    r("e", 0, 0, "weekday");
    r("E", 0, 0, "isoWeekday");
    p("day", "d");
    p("weekday", "e");
    p("isoWeekday", "E");
    w("day", 11);
    w("weekday", 11);
    w("isoWeekday", 11);
    i("d", c);
    i("e", c);
    i("E", c);
    i("dd", function(n, t) {
        return t.weekdaysMinRegex(n)
    });
    i("ddd", function(n, t) {
        return t.weekdaysShortRegex(n)
    });
    i("dddd", function(n, t) {
        return t.weekdaysRegex(n)
    });
    bi(["dd", "ddd", "dddd"], function(n, t, i, r) {
        var f = i._locale.weekdaysParse(n, r, i._strict);
        null != f ? t.d = f : u(i).invalidWeekday = n
    });
    bi(["d", "e", "E"], function(n, t, i, r) {
        t[r] = f(n)
    });
    var bs = "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
        pe = "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
        ks = "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
        ds = wi,
        gs = wi,
        nh = wi;
    r("H", ["HH", 2], 0, "hour");
    r("h", ["hh", 2], 0, nf);
    r("k", ["kk", 2], 0, function() {
        return this.hours() || 24
    });
    r("hmm", 0, 0, function() {
        return "" + nf.apply(this) + ht(this.minutes(), 2)
    });
    r("hmmss", 0, 0, function() {
        return "" + nf.apply(this) + ht(this.minutes(), 2) + ht(this.seconds(), 2)
    });
    r("Hmm", 0, 0, function() {
        return "" + this.hours() + ht(this.minutes(), 2)
    });
    r("Hmmss", 0, 0, function() {
        return "" + this.hours() + ht(this.minutes(), 2) + ht(this.seconds(), 2)
    });
    we("a", !0);
    we("A", !1);
    p("hour", "h");
    w("hour", 13);
    i("a", be);
    i("A", be);
    i("H", c);
    i("h", c);
    i("k", c);
    i("HH", c, d);
    i("hh", c, d);
    i("kk", c, d);
    i("hmm", oe);
    i("hmmss", se);
    i("Hmm", oe);
    i("Hmmss", se);
    h(["H", "HH"], y);
    h(["k", "kk"], function(n, t) {
        var i = f(n);
        t[y] = 24 === i ? 0 : i
    });
    h(["a", "A"], function(n, t, i) {
        i._isPm = i._locale.isPM(n);
        i._meridiem = n
    });
    h(["h", "hh"], function(n, t, i) {
        t[y] = f(n);
        u(i).bigHour = !0
    });
    h("hmm", function(n, t, i) {
        var r = n.length - 2;
        t[y] = f(n.substr(0, r));
        t[ft] = f(n.substr(r));
        u(i).bigHour = !0
    });
    h("hmmss", function(n, t, i) {
        var r = n.length - 4,
            e = n.length - 2;
        t[y] = f(n.substr(0, r));
        t[ft] = f(n.substr(r, 2));
        t[yt] = f(n.substr(e));
        u(i).bigHour = !0
    });
    h("Hmm", function(n, t) {
        var i = n.length - 2;
        t[y] = f(n.substr(0, i));
        t[ft] = f(n.substr(i))
    });
    h("Hmmss", function(n, t) {
        var i = n.length - 4,
            r = n.length - 2;
        t[y] = f(n.substr(0, i));
        t[ft] = f(n.substr(i, 2));
        t[yt] = f(n.substr(r))
    });
    var th = oi("Hours", !0),
        nr, ke = {
            calendar: {
                sameDay: "[Today at] LT",
                nextDay: "[Tomorrow at] LT",
                nextWeek: "dddd [at] LT",
                lastDay: "[Yesterday at] LT",
                lastWeek: "[Last] dddd [at] LT",
                sameElse: "L"
            },
            longDateFormat: {
                LTS: "h:mm:ss A",
                LT: "h:mm A",
                L: "MM/DD/YYYY",
                LL: "MMMM D, YYYY",
                LLL: "MMMM D, YYYY h:mm A",
                LLLL: "dddd, MMMM D, YYYY h:mm A"
            },
            invalidDate: "Invalid date",
            ordinal: "%d",
            dayOfMonthOrdinalParse: /\d{1,2}/,
            relativeTime: {
                future: "in %s",
                past: "%s ago",
                s: "a few seconds",
                ss: "%d seconds",
                m: "a minute",
                mm: "%d minutes",
                h: "an hour",
                hh: "%d hours",
                d: "a day",
                dd: "%d days",
                w: "a week",
                ww: "%d weeks",
                M: "a month",
                MM: "%d months",
                y: "a year",
                yy: "%d years"
            },
            months: ys,
            monthsShort: he,
            week: {
                dow: 0,
                doy: 6
            },
            weekdays: bs,
            weekdaysMin: ks,
            weekdaysShort: pe,
            meridiemParse: /[ap]\.?m?\.?/i
        },
        a = {},
        tr = {};
    var rh = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
        uh = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d|))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([+-]\d\d(?::?\d\d)?|\s*Z)?)?$/,
        fh = /Z|[+-]\d\d(?::?\d\d)?/,
        dr = [
            ["YYYYYY-MM-DD", /[+-]\d{6}-\d\d-\d\d/],
            ["YYYY-MM-DD", /\d{4}-\d\d-\d\d/],
            ["GGGG-[W]WW-E", /\d{4}-W\d\d-\d/],
            ["GGGG-[W]WW", /\d{4}-W\d\d/, !1],
            ["YYYY-DDD", /\d{4}-\d{3}/],
            ["YYYY-MM", /\d{4}-\d\d/, !1],
            ["YYYYYYMMDD", /[+-]\d{10}/],
            ["YYYYMMDD", /\d{8}/],
            ["GGGG[W]WWE", /\d{4}W\d{3}/],
            ["GGGG[W]WW", /\d{4}W\d{2}/, !1],
            ["YYYYDDD", /\d{7}/],
            ["YYYYMM", /\d{6}/, !1],
            ["YYYY", /\d{4}/, !1]
        ],
        uf = [
            ["HH:mm:ss.SSSS", /\d\d:\d\d:\d\d\.\d+/],
            ["HH:mm:ss,SSSS", /\d\d:\d\d:\d\d,\d+/],
            ["HH:mm:ss", /\d\d:\d\d:\d\d/],
            ["HH:mm", /\d\d:\d\d/],
            ["HHmmss.SSSS", /\d\d\d\d\d\d\.\d+/],
            ["HHmmss,SSSS", /\d\d\d\d\d\d,\d+/],
            ["HHmmss", /\d\d\d\d\d\d/],
            ["HHmm", /\d\d\d\d/],
            ["HH", /\d\d/]
        ],
        eh = /^\/?Date\((-?\d+)/i,
        oh = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/,
        sh = {
            UT: 0,
            GMT: 0,
            EDT: -240,
            EST: -300,
            CDT: -300,
            CST: -360,
            MDT: -360,
            MST: -420,
            PDT: -420,
            PST: -480
        };
    for (t.createFromInputFallback = nt("value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.", function(n) {
            n._d = new Date(n._i + (n._useUTC ? " UTC" : ""))
        }), t.ISO_8601 = function() {}, t.RFC_2822 = function() {}, ro = nt("moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/", function() {
            var n = l.apply(null, arguments);
            return this.isValid() && n.isValid() ? n < this ? this : n : ir()
        }), uo = nt("moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/", function() {
            var n = l.apply(null, arguments);
            return this.isValid() && n.isValid() ? this < n ? this : n : ir()
        }), ci = ["year", "quarter", "month", "week", "day", "hour", "minute", "second", "millisecond"], eo("Z", ":"), eo("ZZ", ""), i("Z", yr), i("ZZ", yr), h(["Z", "ZZ"], function(n, t, i) {
            i._useUTC = !0;
            i._tzm = sf(yr, n)
        }), oo = /([\+\-]|\d\d)/gi, t.updateOffset = function() {}, ho = /^(-|\+)?(?:(\d*)[. ])?(\d+):(\d+)(?::(\d+)(\.\d*)?)?$/, co = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/, et.fn = gr.prototype, et.invalid = function() {
            return et(NaN)
        }, yo = ao(1, "add"), po = ao(-1, "subtract"), t.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ", t.defaultFormatUtc = "YYYY-MM-DDTHH:mm:ss[Z]", lf = nt("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.", function(n) {
            return void 0 === n ? this.localeData() : this.locale(n)
        }), af = 126227808e5, r("N", 0, 0, "eraAbbr"), r("NN", 0, 0, "eraAbbr"), r("NNN", 0, 0, "eraAbbr"), r("NNNN", 0, 0, "eraName"), r("NNNNN", 0, 0, "eraNarrow"), r("y", ["y", 1], "yo", "eraYear"), r("y", ["yy", 2], 0, "eraYear"), r("y", ["yyy", 3], 0, "eraYear"), r("y", ["yyyy", 4], 0, "eraYear"), i("N", vf), i("NN", vf), i("NNN", vf), i("NNNN", function(n, t) {
            return t.erasNameRegex(n)
        }), i("NNNNN", function(n, t) {
            return t.erasNarrowRegex(n)
        }), h(["N", "NN", "NNN", "NNNN", "NNNNN"], function(n, t, i, r) {
            var f = i._locale.erasParse(n, r, i._strict);
            f ? u(i).era = f : u(i).invalidEra = n
        }), i("y", si), i("yy", si), i("yyy", si), i("yyyy", si), i("yo", function(n, t) {
            return t._eraYearOrdinalRegex || si
        }), h(["y", "yy", "yyy", "yyyy"], b), h(["yo"], function(n, t, i) {
            var r;
            i._locale._eraYearOrdinalRegex && (r = n.match(i._locale._eraYearOrdinalRegex));
            t[b] = i._locale.eraYearOrdinalParse ? i._locale.eraYearOrdinalParse(n, r) : parseInt(n, 10)
        }), r(0, ["gg", 2], 0, function() {
            return this.weekYear() % 100
        }), r(0, ["GG", 2], 0, function() {
            return this.isoWeekYear() % 100
        }), iu("gggg", "weekYear"), iu("ggggg", "weekYear"), iu("GGGG", "isoWeekYear"), iu("GGGGG", "isoWeekYear"), p("weekYear", "gg"), p("isoWeekYear", "GG"), w("weekYear", 1), w("isoWeekYear", 1), i("G", vr), i("g", vr), i("GG", c, d), i("gg", c, d), i("GGGG", bu, wu), i("gggg", bu, wu), i("GGGGG", ar, cr), i("ggggg", ar, cr), bi(["gggg", "ggggg", "GGGG", "GGGGG"], function(n, t, i, r) {
            t[r.substr(0, 2)] = f(n)
        }), bi(["gg", "GG"], function(n, i, r, u) {
            i[u] = t.parseTwoDigitYear(n)
        }), r("Q", 0, "Qo", "quarter"), p("quarter", "Q"), w("quarter", 7), i("Q", fe), h("Q", function(n, t) {
            t[vt] = 3 * (f(n) - 1)
        }), r("D", ["DD", 2], "Do", "date"), p("date", "D"), w("date", 9), i("D", c), i("DD", c, d), i("Do", function(n, t) {
            return n ? t._dayOfMonthOrdinalParse || t._ordinalParse : t._dayOfMonthOrdinalParseLenient
        }), h(["D", "DD"], ct), h("Do", function(n, t) {
            t[ct] = f(n.match(c)[0])
        }), pf = oi("Date", !0), r("DDD", ["DDDD", 3], "DDDo", "dayOfYear"), p("dayOfYear", "DDD"), w("dayOfYear", 4), i("DDD", lr), i("DDDD", ee), h(["DDD", "DDDD"], function(n, t, i) {
            i._dayOfYear = f(n)
        }), r("m", ["mm", 2], 0, "minute"), p("minute", "m"), w("minute", 14), i("m", c), i("mm", c, d), h(["m", "mm"], ft), is = oi("Minutes", !1), r("s", ["ss", 2], 0, "second"), p("second", "s"), w("second", 15), i("s", c), i("ss", c, d), h(["s", "ss"], yt), us = oi("Seconds", !1), r("S", 0, 0, function() {
            return ~~(this.millisecond() / 100)
        }), r(0, ["SS", 2], 0, function() {
            return ~~(this.millisecond() / 10)
        }), r(0, ["SSS", 3], 0, "millisecond"), r(0, ["SSSS", 4], 0, function() {
            return 10 * this.millisecond()
        }), r(0, ["SSSSS", 5], 0, function() {
            return 100 * this.millisecond()
        }), r(0, ["SSSSSS", 6], 0, function() {
            return 1e3 * this.millisecond()
        }), r(0, ["SSSSSSS", 7], 0, function() {
            return 1e4 * this.millisecond()
        }), r(0, ["SSSSSSSS", 8], 0, function() {
            return 1e5 * this.millisecond()
        }), r(0, ["SSSSSSSSS", 9], 0, function() {
            return 1e6 * this.millisecond()
        }), p("millisecond", "ms"), w("millisecond", 16), i("S", lr, fe), i("SS", lr, d), i("SSS", lr, ee), ni = "SSSS"; ni.length <= 9; ni += "S") i(ni, si);
    for (ni = "S"; ni.length <= 9; ni += "S") h(ni, lh);
    rs = oi("Milliseconds", !1);
    r("z", 0, 0, "zoneAbbr");
    r("zz", 0, 0, "zoneName");
    n = pi.prototype;
    n.add = yo;
    n.calendar = function(n, i) {
        1 === arguments.length && (arguments[0] ? ch(arguments[0]) ? (n = arguments[0], i = void 0) : function(n) {
            for (var u = ti(n) && !eu(n), t = !1, r = ["sameDay", "nextDay", "lastDay", "nextWeek", "lastWeek", "sameElse"], i = 0; i < r.length; i += 1) t = t || s(n, r[i]);
            return u && t
        }(arguments[0]) && (i = arguments[0], n = void 0) : i = n = void 0);
        var u = n || l(),
            f = hf(u, this).startOf("day"),
            r = t.calendarFormat(this, f) || "sameElse",
            e = i && (st(i[r]) ? i[r].call(this, u) : i[r]);
        return this.format(e || this.localeData().calendar(r, this, l(u)))
    };
    n.clone = function() {
        return new pi(this)
    };
    n.diff = function(n, t, i) {
        var r, f, u;
        if (!this.isValid()) return NaN;
        if (!(r = hf(n, this)).isValid()) return NaN;
        switch (f = 6e4 * (r.utcOffset() - this.utcOffset()), t = tt(t)) {
            case "year":
                u = tu(this, r) / 12;
                break;
            case "month":
                u = tu(this, r);
                break;
            case "quarter":
                u = tu(this, r) / 3;
                break;
            case "second":
                u = (this - r) / 1e3;
                break;
            case "minute":
                u = (this - r) / 6e4;
                break;
            case "hour":
                u = (this - r) / 36e5;
                break;
            case "day":
                u = (this - r - f) / 864e5;
                break;
            case "week":
                u = (this - r - f) / 6048e5;
                break;
            default:
                u = this - r
        }
        return i ? u : it(u)
    };
    n.endOf = function(n) {
        var i, r;
        if (void 0 === (n = tt(n)) || "millisecond" === n || !this.isValid()) return this;
        switch (r = this._isUTC ? ns : go, n) {
            case "year":
                i = r(this.year() + 1, 0, 1) - 1;
                break;
            case "quarter":
                i = r(this.year(), this.month() - this.month() % 3 + 3, 1) - 1;
                break;
            case "month":
                i = r(this.year(), this.month() + 1, 1) - 1;
                break;
            case "week":
                i = r(this.year(), this.month(), this.date() - this.weekday() + 7) - 1;
                break;
            case "isoWeek":
                i = r(this.year(), this.month(), this.date() - (this.isoWeekday() - 1) + 7) - 1;
                break;
            case "day":
            case "date":
                i = r(this.year(), this.month(), this.date() + 1) - 1;
                break;
            case "hour":
                i = this._d.valueOf();
                i += 3599999 - li(i + (this._isUTC ? 0 : 6e4 * this.utcOffset()), 36e5);
                break;
            case "minute":
                i = this._d.valueOf();
                i += 59999 - li(i, 6e4);
                break;
            case "second":
                i = this._d.valueOf();
                i += 999 - li(i, 1e3)
        }
        return this._d.setTime(i), t.updateOffset(this, !0), this
    };
    n.format = function(n) {
        n = n || (this.isUtc() ? t.defaultFormatUtc : t.defaultFormat);
        var i = er(this, n);
        return this.localeData().postformat(i)
    };
    n.from = function(n, t) {
        return this.isValid() && (ut(n) && n.isValid() || l(n).isValid()) ? et({
            to: this,
            from: n
        }).locale(this.locale()).humanize(!t) : this.localeData().invalidDate()
    };
    n.fromNow = function(n) {
        return this.from(l(), n)
    };
    n.to = function(n, t) {
        return this.isValid() && (ut(n) && n.isValid() || l(n).isValid()) ? et({
            from: this,
            to: n
        }).locale(this.locale()).humanize(!t) : this.localeData().invalidDate()
    };
    n.toNow = function(n) {
        return this.to(l(), n)
    };
    n.get = function(n) {
        return st(this[n = tt(n)]) ? this[n]() : this
    };
    n.invalidAt = function() {
        return u(this).overflow
    };
    n.isAfter = function(n, t) {
        var i = ut(n) ? n : l(n);
        return !(!this.isValid() || !i.isValid()) && ("millisecond" === (t = tt(t) || "millisecond") ? this.valueOf() > i.valueOf() : i.valueOf() < this.clone().startOf(t).valueOf())
    };
    n.isBefore = function(n, t) {
        var i = ut(n) ? n : l(n);
        return !(!this.isValid() || !i.isValid()) && ("millisecond" === (t = tt(t) || "millisecond") ? this.valueOf() < i.valueOf() : this.clone().endOf(t).valueOf() < i.valueOf())
    };
    n.isBetween = function(n, t, i, r) {
        var u = ut(n) ? n : l(n),
            f = ut(t) ? t : l(t);
        return !!(this.isValid() && u.isValid() && f.isValid()) && ("(" === (r = r || "()")[0] ? this.isAfter(u, i) : !this.isBefore(u, i)) && (")" === r[1] ? this.isBefore(f, i) : !this.isAfter(f, i))
    };
    n.isSame = function(n, t) {
        var i, r = ut(n) ? n : l(n);
        return !(!this.isValid() || !r.isValid()) && ("millisecond" === (t = tt(t) || "millisecond") ? this.valueOf() === r.valueOf() : (i = r.valueOf(), this.clone().startOf(t).valueOf() <= i && i <= this.clone().endOf(t).valueOf()))
    };
    n.isSameOrAfter = function(n, t) {
        return this.isSame(n, t) || this.isAfter(n, t)
    };
    n.isSameOrBefore = function(n, t) {
        return this.isSame(n, t) || this.isBefore(n, t)
    };
    n.isValid = function() {
        return ou(this)
    };
    n.lang = lf;
    n.locale = bo;
    n.localeData = ko;
    n.max = uo;
    n.min = ro;
    n.parsingFlags = function() {
        return dt({}, u(this))
    };
    n.set = function(n, t) {
        if ("object" == typeof n)
            for (var r = function(n) {
                    var t, i = [];
                    for (t in n) s(n, t) && i.push({
                        unit: t,
                        priority: pu[t]
                    });
                    return i.sort(function(n, t) {
                        return n.priority - t.priority
                    }), i
                }(n = yu(n)), i = 0; i < r.length; i++) this[r[i].unit](n[r[i].unit]);
        else if (st(this[n = tt(n)])) return this[n](t);
        return this
    };
    n.startOf = function(n) {
        var i, r;
        if (void 0 === (n = tt(n)) || "millisecond" === n || !this.isValid()) return this;
        switch (r = this._isUTC ? ns : go, n) {
            case "year":
                i = r(this.year(), 0, 1);
                break;
            case "quarter":
                i = r(this.year(), this.month() - this.month() % 3, 1);
                break;
            case "month":
                i = r(this.year(), this.month(), 1);
                break;
            case "week":
                i = r(this.year(), this.month(), this.date() - this.weekday());
                break;
            case "isoWeek":
                i = r(this.year(), this.month(), this.date() - (this.isoWeekday() - 1));
                break;
            case "day":
            case "date":
                i = r(this.year(), this.month(), this.date());
                break;
            case "hour":
                i = this._d.valueOf();
                i -= li(i + (this._isUTC ? 0 : 6e4 * this.utcOffset()), 36e5);
                break;
            case "minute":
                i = this._d.valueOf();
                i -= li(i, 6e4);
                break;
            case "second":
                i = this._d.valueOf();
                i -= li(i, 1e3)
        }
        return this._d.setTime(i), t.updateOffset(this, !0), this
    };
    n.subtract = po;
    n.toArray = function() {
        var n = this;
        return [n.year(), n.month(), n.date(), n.hour(), n.minute(), n.second(), n.millisecond()]
    };
    n.toObject = function() {
        var n = this;
        return {
            years: n.year(),
            months: n.month(),
            date: n.date(),
            hours: n.hours(),
            minutes: n.minutes(),
            seconds: n.seconds(),
            milliseconds: n.milliseconds()
        }
    };
    n.toDate = function() {
        return new Date(this.valueOf())
    };
    n.toISOString = function(n) {
        if (!this.isValid()) return null;
        var i = !0 !== n,
            t = i ? this.clone().utc() : this;
        return t.year() < 0 || 9999 < t.year() ? er(t, i ? "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYYYY-MM-DD[T]HH:mm:ss.SSSZ") : st(Date.prototype.toISOString) ? i ? this.toDate().toISOString() : new Date(this.valueOf() + 6e4 * this.utcOffset()).toISOString().replace("Z", er(t, "Z")) : er(t, i ? "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]" : "YYYY-MM-DD[T]HH:mm:ss.SSSZ")
    };
    n.inspect = function() {
        if (!this.isValid()) return "moment.invalid(/* " + this._i + " */)";
        var n, t, i, r = "moment",
            u = "";
        return this.isLocal() || (r = 0 === this.utcOffset() ? "moment.utc" : "moment.parseZone", u = "Z"), n = "[" + r + '("]', t = 0 <= this.year() && this.year() <= 9999 ? "YYYY" : "YYYYYY", i = u + '[")]', this.format(n + t + "-MM-DD[T]HH:mm:ss.SSS" + i)
    };
    "undefined" != typeof Symbol && null != Symbol.for && (n[Symbol.for("nodejs.util.inspect.custom")] = function() {
        return "Moment<" + this.format() + ">"
    });
    n.toJSON = function() {
        return this.isValid() ? this.toISOString() : null
    };
    n.toString = function() {
        return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")
    };
    n.unix = function() {
        return Math.floor(this.valueOf() / 1e3)
    };
    n.valueOf = function() {
        return this._d.valueOf() - 6e4 * (this._offset || 0)
    };
    n.creationData = function() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict
        }
    };
    n.eraName = function() {
        for (var i, t = this.localeData().eras(), n = 0, r = t.length; n < r; ++n)
            if ((i = this.clone().startOf("day").valueOf(), t[n].since <= i && i <= t[n].until) || t[n].until <= i && i <= t[n].since) return t[n].name;
        return ""
    };
    n.eraNarrow = function() {
        for (var i, t = this.localeData().eras(), n = 0, r = t.length; n < r; ++n)
            if ((i = this.clone().startOf("day").valueOf(), t[n].since <= i && i <= t[n].until) || t[n].until <= i && i <= t[n].since) return t[n].narrow;
        return ""
    };
    n.eraAbbr = function() {
        for (var i, t = this.localeData().eras(), n = 0, r = t.length; n < r; ++n)
            if ((i = this.clone().startOf("day").valueOf(), t[n].since <= i && i <= t[n].until) || t[n].until <= i && i <= t[n].since) return t[n].abbr;
        return ""
    };
    n.eraYear = function() {
        for (var u, r, i = this.localeData().eras(), n = 0, f = i.length; n < f; ++n)
            if (u = i[n].since <= i[n].until ? 1 : -1, r = this.clone().startOf("day").valueOf(), i[n].since <= r && r <= i[n].until || i[n].until <= r && r <= i[n].since) return (this.year() - t(i[n].since).year()) * u + i[n].offset;
        return this.year()
    };
    n.year = ku;
    n.isLeapYear = function() {
        return or(this.year())
    };
    n.weekYear = function(n) {
        return ts.call(this, n, this.week(), this.weekday(), this.localeData()._week.dow, this.localeData()._week.doy)
    };
    n.isoWeekYear = function(n) {
        return ts.call(this, n, this.isoWeek(), this.isoWeekday(), 1, 4)
    };
    n.quarter = n.quarters = function(n) {
        return null == n ? Math.ceil((this.month() + 1) / 3) : this.month(3 * (n - 1) + this.month() % 3)
    };
    n.month = ae;
    n.daysInMonth = function() {
        return wr(this.year(), this.month())
    };
    n.week = n.weeks = function(n) {
        var t = this.localeData().week(this);
        return null == n ? t : this.add(7 * (n - t), "d")
    };
    n.isoWeek = n.isoWeeks = function(n) {
        var t = gi(this, 1, 4).week;
        return null == n ? t : this.add(7 * (n - t), "d")
    };
    n.weeksInYear = function() {
        var n = this.localeData()._week;
        return pt(this.year(), n.dow, n.doy)
    };
    n.weeksInWeekYear = function() {
        var n = this.localeData()._week;
        return pt(this.weekYear(), n.dow, n.doy)
    };
    n.isoWeeksInYear = function() {
        return pt(this.year(), 1, 4)
    };
    n.isoWeeksInISOWeekYear = function() {
        return pt(this.isoWeekYear(), 1, 4)
    };
    n.date = pf;
    n.day = n.days = function(n) {
        if (!this.isValid()) return null != n ? this : NaN;
        var t, i, r = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        return null != n ? (t = n, i = this.localeData(), n = "string" != typeof t ? t : isNaN(t) ? "number" == typeof(t = i.weekdaysParse(t)) ? t : null : parseInt(t, 10), this.add(n - r, "d")) : r
    };
    n.weekday = function(n) {
        if (!this.isValid()) return null != n ? this : NaN;
        var t = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return null == n ? t : this.add(n - t, "d")
    };
    n.isoWeekday = function(n) {
        if (!this.isValid()) return null != n ? this : NaN;
        if (null == n) return this.day() || 7;
        var t, i, r = (t = n, i = this.localeData(), "string" == typeof t ? i.weekdaysParse(t) % 7 || 7 : isNaN(t) ? null : t);
        return this.day(this.day() % 7 ? r : r - 7)
    };
    n.dayOfYear = function(n) {
        var t = Math.round((this.clone().startOf("day") - this.clone().startOf("year")) / 864e5) + 1;
        return null == n ? t : this.add(n - t, "d")
    };
    n.hour = n.hours = th;
    n.minute = n.minutes = is;
    n.second = n.seconds = us;
    n.millisecond = n.milliseconds = rs;
    n.utcOffset = function(n, i, r) {
        var u, f = this._offset || 0;
        if (!this.isValid()) return null != n ? this : NaN;
        if (null == n) return this._isUTC ? f : cf(this);
        if ("string" == typeof n) {
            if (null === (n = sf(yr, n))) return this
        } else Math.abs(n) < 16 && !r && (n *= 60);
        return !this._isUTC && i && (u = cf(this)), this._offset = n, this._isUTC = !0, null != u && this.add(u, "m"), f !== n && (!i || this._changeInProgress ? vo(this, et(n - f, "m"), 1, !1) : this._changeInProgress || (this._changeInProgress = !0, t.updateOffset(this, !0), this._changeInProgress = null)), this
    };
    n.utc = function(n) {
        return this.utcOffset(0, n)
    };
    n.local = function(n) {
        return this._isUTC && (this.utcOffset(0, n), this._isUTC = !1, n && this.subtract(cf(this), "m")), this
    };
    n.parseZone = function() {
        var n;
        return null != this._tzm ? this.utcOffset(this._tzm, !1, !0) : "string" == typeof this._i && (null != (n = sf(cs, this._i)) ? this.utcOffset(n) : this.utcOffset(0, !0)), this
    };
    n.hasAlignedHourOffset = function(n) {
        return !!this.isValid() && (n = n ? l(n).utcOffset() : 0, (this.utcOffset() - n) % 60 == 0)
    };
    n.isDST = function() {
        return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset()
    };
    n.isLocal = function() {
        return !!this.isValid() && !this._isUTC
    };
    n.isUtcOffset = function() {
        return !!this.isValid() && this._isUTC
    };
    n.isUtc = so;
    n.isUTC = so;
    n.zoneAbbr = function() {
        return this._isUTC ? "UTC" : ""
    };
    n.zoneName = function() {
        return this._isUTC ? "Coordinated Universal Time" : ""
    };
    n.dates = nt("dates accessor is deprecated. Use date instead.", pf);
    n.months = nt("months accessor is deprecated. Use month instead", ae);
    n.years = nt("years accessor is deprecated. Use year instead", ku);
    n.zone = nt("moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/", function(n, t) {
        return null != n ? ("string" != typeof n && (n = -n), this.utcOffset(n, t), this) : -this.utcOffset()
    });
    n.isDSTShifted = nt("isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information", function() {
        if (!k(this._isDSTShifted)) return this._isDSTShifted;
        var t, n = {};
        return su(n, this), (n = to(n))._a ? (t = (n._isUTC ? ot : l)(n._a), this._isDSTShifted = this.isValid() && 0 < function(n, t, i) {
            for (var e = Math.min(n.length, t.length), o = Math.abs(n.length - t.length), u = 0, r = 0; r < e; r++)(i && n[r] !== t[r] || !i && f(n[r]) !== f(t[r])) && u++;
            return u + o
        }(n._a, t.toArray())) : this._isDSTShifted = !1, this._isDSTShifted
    });
    o = lu.prototype;
    o.calendar = function(n, t, i) {
        var r = this._calendar[n] || this._calendar.sameElse;
        return st(r) ? r.call(t, i) : r
    };
    o.longDateFormat = function(n) {
        var t = this._longDateFormat[n],
            i = this._longDateFormat[n.toUpperCase()];
        return t || !i ? t : (this._longDateFormat[n] = i.match(au).map(function(n) {
            return "MMMM" === n || "MM" === n || "DD" === n || "dddd" === n ? n.slice(1) : n
        }).join(""), this._longDateFormat[n])
    };
    o.invalidDate = function() {
        return this._invalidDate
    };
    o.ordinal = function(n) {
        return this._ordinal.replace("%d", n)
    };
    o.preparse = fs;
    o.postformat = fs;
    o.relativeTime = function(n, t, i, r) {
        var u = this._relativeTime[i];
        return st(u) ? u(n, t, i, r) : u.replace(/%d/i, n)
    };
    o.pastFuture = function(n, t) {
        var i = this._relativeTime[0 < n ? "future" : "past"];
        return st(i) ? i(t) : i.replace(/%s/i, t)
    };
    o.set = function(n) {
        var i;
        for (var t in n) s(n, t) && (st(i = n[t]) ? this[t] = i : this["_" + t] = i);
        this._config = n;
        this._dayOfMonthOrdinalParseLenient = new RegExp((this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) + "|" + /\d{1,2}/.source)
    };
    o.eras = function() {
        for (var r, n = this._eras || wt("en")._eras, i = 0, u = n.length; i < u; ++i) {
            switch (typeof n[i].since) {
                case "string":
                    r = t(n[i].since).startOf("day");
                    n[i].since = r.valueOf()
            }
            switch (typeof n[i].until) {
                case "undefined":
                    n[i].until = 1 / 0;
                    break;
                case "string":
                    r = t(n[i].until).startOf("day").valueOf();
                    n[i].until = r.valueOf()
            }
        }
        return n
    };
    o.erasParse = function(n, t, i) {
        var r, s, f, e, o, u = this.eras();
        for (n = n.toUpperCase(), r = 0, s = u.length; r < s; ++r)
            if (f = u[r].name.toUpperCase(), e = u[r].abbr.toUpperCase(), o = u[r].narrow.toUpperCase(), i) switch (t) {
                case "N":
                case "NN":
                case "NNN":
                    if (e === n) return u[r];
                    break;
                case "NNNN":
                    if (f === n) return u[r];
                    break;
                case "NNNNN":
                    if (o === n) return u[r]
            } else if (0 <= [f, e, o].indexOf(n)) return u[r]
    };
    o.erasConvertYear = function(n, i) {
        var r = n.since <= n.until ? 1 : -1;
        return void 0 === i ? t(n.since).year() : t(n.since).year() + (i - n.offset) * r
    };
    o.erasAbbrRegex = function(n) {
        return s(this, "_erasAbbrRegex") || yf.call(this), n ? this._erasAbbrRegex : this._erasRegex
    };
    o.erasNameRegex = function(n) {
        return s(this, "_erasNameRegex") || yf.call(this), n ? this._erasNameRegex : this._erasRegex
    };
    o.erasNarrowRegex = function(n) {
        return s(this, "_erasNarrowRegex") || yf.call(this), n ? this._erasNarrowRegex : this._erasRegex
    };
    o.months = function(n, t) {
        return n ? rt(this._months) ? this._months[n.month()] : this._months[(this._months.isFormat || ce).test(t) ? "format" : "standalone"][n.month()] : rt(this._months) ? this._months : this._months.standalone
    };
    o.monthsShort = function(n, t) {
        return n ? rt(this._monthsShort) ? this._monthsShort[n.month()] : this._monthsShort[ce.test(t) ? "format" : "standalone"][n.month()] : rt(this._monthsShort) ? this._monthsShort : this._monthsShort.standalone
    };
    o.monthsParse = function(n, t, i) {
        var r, u, f;
        if (this._monthsParseExact) return function(n, t, i) {
            var u, r, e, f = n.toLocaleLowerCase();
            if (!this._monthsParse)
                for (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = [], u = 0; u < 12; ++u) e = ot([2e3, u]), this._shortMonthsParse[u] = this.monthsShort(e, "").toLocaleLowerCase(), this._longMonthsParse[u] = this.months(e, "").toLocaleLowerCase();
            return i ? "MMM" === t ? -1 !== (r = v.call(this._shortMonthsParse, f)) ? r : null : -1 !== (r = v.call(this._longMonthsParse, f)) ? r : null : "MMM" === t ? -1 !== (r = v.call(this._shortMonthsParse, f)) || -1 !== (r = v.call(this._longMonthsParse, f)) ? r : null : -1 !== (r = v.call(this._longMonthsParse, f)) || -1 !== (r = v.call(this._shortMonthsParse, f)) ? r : null
        }.call(this, n, t, i);
        for (this._monthsParse || (this._monthsParse = [], this._longMonthsParse = [], this._shortMonthsParse = []), r = 0; r < 12; r++)
            if ((u = ot([2e3, r]), i && !this._longMonthsParse[r] && (this._longMonthsParse[r] = new RegExp("^" + this.months(u, "").replace(".", "") + "$", "i"), this._shortMonthsParse[r] = new RegExp("^" + this.monthsShort(u, "").replace(".", "") + "$", "i")), i || this._monthsParse[r] || (f = "^" + this.months(u, "") + "|^" + this.monthsShort(u, ""), this._monthsParse[r] = new RegExp(f.replace(".", ""), "i")), i && "MMMM" === t && this._longMonthsParse[r].test(n)) || i && "MMM" === t && this._shortMonthsParse[r].test(n) || !i && this._monthsParse[r].test(n)) return r
    };
    o.monthsRegex = function(n) {
        return this._monthsParseExact ? (s(this, "_monthsRegex") || ve.call(this), n ? this._monthsStrictRegex : this._monthsRegex) : (s(this, "_monthsRegex") || (this._monthsRegex = ws), this._monthsStrictRegex && n ? this._monthsStrictRegex : this._monthsRegex)
    };
    o.monthsShortRegex = function(n) {
        return this._monthsParseExact ? (s(this, "_monthsRegex") || ve.call(this), n ? this._monthsShortStrictRegex : this._monthsShortRegex) : (s(this, "_monthsShortRegex") || (this._monthsShortRegex = ps), this._monthsShortStrictRegex && n ? this._monthsShortStrictRegex : this._monthsShortRegex)
    };
    o.week = function(n) {
        return gi(n, this._week.dow, this._week.doy).week
    };
    o.firstDayOfYear = function() {
        return this._week.doy
    };
    o.firstDayOfWeek = function() {
        return this._week.dow
    };
    o.weekdays = function(n, t) {
        var i = rt(this._weekdays) ? this._weekdays : this._weekdays[n && !0 !== n && this._weekdays.isFormat.test(t) ? "format" : "standalone"];
        return !0 === n ? du(i, this._week.dow) : n ? i[n.day()] : i
    };
    o.weekdaysMin = function(n) {
        return !0 === n ? du(this._weekdaysMin, this._week.dow) : n ? this._weekdaysMin[n.day()] : this._weekdaysMin
    };
    o.weekdaysShort = function(n) {
        return !0 === n ? du(this._weekdaysShort, this._week.dow) : n ? this._weekdaysShort[n.day()] : this._weekdaysShort
    };
    o.weekdaysParse = function(n, t, i) {
        var r, u, f;
        if (this._weekdaysParseExact) return function(n, t, i) {
            var f, r, e, u = n.toLocaleLowerCase();
            if (!this._weekdaysParse)
                for (this._weekdaysParse = [], this._shortWeekdaysParse = [], this._minWeekdaysParse = [], f = 0; f < 7; ++f) e = ot([2e3, 1]).day(f), this._minWeekdaysParse[f] = this.weekdaysMin(e, "").toLocaleLowerCase(), this._shortWeekdaysParse[f] = this.weekdaysShort(e, "").toLocaleLowerCase(), this._weekdaysParse[f] = this.weekdays(e, "").toLocaleLowerCase();
            return i ? "dddd" === t ? -1 !== (r = v.call(this._weekdaysParse, u)) ? r : null : "ddd" === t ? -1 !== (r = v.call(this._shortWeekdaysParse, u)) ? r : null : -1 !== (r = v.call(this._minWeekdaysParse, u)) ? r : null : "dddd" === t ? -1 !== (r = v.call(this._weekdaysParse, u)) || -1 !== (r = v.call(this._shortWeekdaysParse, u)) || -1 !== (r = v.call(this._minWeekdaysParse, u)) ? r : null : "ddd" === t ? -1 !== (r = v.call(this._shortWeekdaysParse, u)) || -1 !== (r = v.call(this._weekdaysParse, u)) || -1 !== (r = v.call(this._minWeekdaysParse, u)) ? r : null : -1 !== (r = v.call(this._minWeekdaysParse, u)) || -1 !== (r = v.call(this._weekdaysParse, u)) || -1 !== (r = v.call(this._shortWeekdaysParse, u)) ? r : null
        }.call(this, n, t, i);
        for (this._weekdaysParse || (this._weekdaysParse = [], this._minWeekdaysParse = [], this._shortWeekdaysParse = [], this._fullWeekdaysParse = []), r = 0; r < 7; r++)
            if ((u = ot([2e3, 1]).day(r), i && !this._fullWeekdaysParse[r] && (this._fullWeekdaysParse[r] = new RegExp("^" + this.weekdays(u, "").replace(".", "\\.?") + "$", "i"), this._shortWeekdaysParse[r] = new RegExp("^" + this.weekdaysShort(u, "").replace(".", "\\.?") + "$", "i"), this._minWeekdaysParse[r] = new RegExp("^" + this.weekdaysMin(u, "").replace(".", "\\.?") + "$", "i")), this._weekdaysParse[r] || (f = "^" + this.weekdays(u, "") + "|^" + this.weekdaysShort(u, "") + "|^" + this.weekdaysMin(u, ""), this._weekdaysParse[r] = new RegExp(f.replace(".", ""), "i")), i && "dddd" === t && this._fullWeekdaysParse[r].test(n)) || i && "ddd" === t && this._shortWeekdaysParse[r].test(n) || i && "dd" === t && this._minWeekdaysParse[r].test(n) || !i && this._weekdaysParse[r].test(n)) return r
    };
    o.weekdaysRegex = function(n) {
        return this._weekdaysParseExact ? (s(this, "_weekdaysRegex") || gu.call(this), n ? this._weekdaysStrictRegex : this._weekdaysRegex) : (s(this, "_weekdaysRegex") || (this._weekdaysRegex = ds), this._weekdaysStrictRegex && n ? this._weekdaysStrictRegex : this._weekdaysRegex)
    };
    o.weekdaysShortRegex = function(n) {
        return this._weekdaysParseExact ? (s(this, "_weekdaysRegex") || gu.call(this), n ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex) : (s(this, "_weekdaysShortRegex") || (this._weekdaysShortRegex = gs), this._weekdaysShortStrictRegex && n ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex)
    };
    o.weekdaysMinRegex = function(n) {
        return this._weekdaysParseExact ? (s(this, "_weekdaysRegex") || gu.call(this), n ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex) : (s(this, "_weekdaysMinRegex") || (this._weekdaysMinRegex = nh), this._weekdaysMinStrictRegex && n ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex)
    };
    o.isPM = function(n) {
        return "p" === (n + "").toLowerCase().charAt(0)
    };
    o.meridiem = function(n, t, i) {
        return 11 < n ? i ? "pm" : "PM" : i ? "am" : "AM"
    };
    gt("en", {
        eras: [{
            since: "0001-01-01",
            until: 1 / 0,
            offset: 1,
            name: "Anno Domini",
            narrow: "AD",
            abbr: "AD"
        }, {
            since: "0000-12-31",
            until: -1 / 0,
            offset: 1,
            name: "Before Christ",
            narrow: "BC",
            abbr: "BC"
        }],
        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function(n) {
            var t = n % 10;
            return n + (1 === f(n % 100 / 10) ? "th" : 1 == t ? "st" : 2 == t ? "nd" : 3 == t ? "rd" : "th")
        }
    });
    t.lang = nt("moment.lang is deprecated. Use moment.locale instead.", gt);
    t.langData = nt("moment.langData is deprecated. Use moment.localeData instead.", wt);
    lt = Math.abs;
    var ah = bt("ms"),
        vh = bt("s"),
        yh = bt("m"),
        ph = bt("h"),
        wh = bt("d"),
        bh = bt("w"),
        kh = bt("M"),
        dh = bt("Q"),
        gh = bt("y");
    var nc = ui("milliseconds"),
        tc = ui("seconds"),
        ic = ui("minutes"),
        rc = ui("hours"),
        uc = ui("days"),
        fc = ui("months"),
        ec = ui("years"),
        kt = Math.round,
        ai = {
            ss: 44,
            s: 45,
            m: 45,
            h: 22,
            d: 26,
            w: null,
            M: 11
        };
    return uu = Math.abs, e = gr.prototype, e.isValid = function() {
        return this._isValid
    }, e.abs = function() {
        var n = this._data;
        return this._milliseconds = lt(this._milliseconds), this._days = lt(this._days), this._months = lt(this._months), n.milliseconds = lt(n.milliseconds), n.seconds = lt(n.seconds), n.minutes = lt(n.minutes), n.hours = lt(n.hours), n.months = lt(n.months), n.years = lt(n.years), this
    }, e.add = function(n, t) {
        return os(this, n, t, 1)
    }, e.subtract = function(n, t) {
        return os(this, n, t, -1)
    }, e.as = function(n) {
        if (!this.isValid()) return NaN;
        var t, r, i = this._milliseconds;
        if ("month" === (n = tt(n)) || "quarter" === n || "year" === n) switch (t = this._days + i / 864e5, r = this._months + hs(t), n) {
            case "month":
                return r;
            case "quarter":
                return r / 3;
            case "year":
                return r / 12
        } else switch (t = this._days + Math.round(bf(this._months)), n) {
            case "week":
                return t / 7 + i / 6048e5;
            case "day":
                return t + i / 864e5;
            case "hour":
                return 24 * t + i / 36e5;
            case "minute":
                return 1440 * t + i / 6e4;
            case "second":
                return 86400 * t + i / 1e3;
            case "millisecond":
                return Math.floor(864e5 * t) + i;
            default:
                throw new Error("Unknown unit " + n);
        }
    }, e.asMilliseconds = ah, e.asSeconds = vh, e.asMinutes = yh, e.asHours = ph, e.asDays = wh, e.asWeeks = bh, e.asMonths = kh, e.asQuarters = dh, e.asYears = gh, e.valueOf = function() {
        return this.isValid() ? this._milliseconds + 864e5 * this._days + this._months % 12 * 2592e6 + 31536e6 * f(this._months / 12) : NaN
    }, e._bubble = function() {
        var u, f, e, o, s, r = this._milliseconds,
            n = this._days,
            t = this._months,
            i = this._data;
        return 0 <= r && 0 <= n && 0 <= t || r <= 0 && n <= 0 && t <= 0 || (r += 864e5 * ss(bf(t) + n), t = n = 0), i.milliseconds = r % 1e3, u = it(r / 1e3), i.seconds = u % 60, f = it(u / 60), i.minutes = f % 60, e = it(f / 60), i.hours = e % 24, n += it(e / 24), t += s = it(hs(n)), n -= ss(bf(s)), o = it(t / 12), t %= 12, i.days = n, i.months = t, i.years = o, this
    }, e.clone = function() {
        return et(this)
    }, e.get = function(n) {
        return n = tt(n), this.isValid() ? this[n + "s"]() : NaN
    }, e.milliseconds = nc, e.seconds = tc, e.minutes = ic, e.hours = rc, e.days = uc, e.weeks = function() {
        return it(this.days() / 7)
    }, e.months = fc, e.years = ec, e.humanize = function(n, t) {
        if (!this.isValid()) return this.localeData().invalidDate();
        var i, r, u = !1,
            f = ai;
        return "object" == typeof n && (t = n, n = !1), "boolean" == typeof n && (u = n), "object" == typeof t && (f = Object.assign({}, ai, t), null != t.s && null == t.ss && (f.ss = t.s - 1)), i = this.localeData(), r = oc(this, !u, f, i), u && (r = i.pastFuture(+this, r)), i.postformat(r)
    }, e.toISOString = fu, e.toString = fu, e.toJSON = fu, e.locale = bo, e.localeData = ko, e.toIsoString = nt("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)", fu), e.lang = lf, r("X", 0, 0, "unix"), r("x", 0, 0, "valueOf"), i("x", vr), i("X", /[+-]?\d+(\.\d{1,3})?/), h("X", function(n, t, i) {
        i._d = new Date(1e3 * parseFloat(n))
    }), h("x", function(n, t, i) {
        i._d = new Date(f(n))
    }), t.version = "2.29.1", kf = l, t.fn = n, t.min = function() {
        return fo("isBefore", [].slice.call(arguments, 0))
    }, t.max = function() {
        return fo("isAfter", [].slice.call(arguments, 0))
    }, t.now = function() {
        return Date.now ? Date.now() : +new Date
    }, t.utc = ot, t.unix = function(n) {
        return l(1e3 * n)
    }, t.months = function(n, t) {
        return es(n, t, "months")
    }, t.isDate = yi, t.locale = gt, t.invalid = ir, t.duration = et, t.isMoment = ut, t.weekdays = function(n, t, i) {
        return wf(n, t, i, "weekdays")
    }, t.parseZone = function() {
        return l.apply(null, arguments).parseZone()
    }, t.localeData = wt, t.isDuration = nu, t.monthsShort = function(n, t) {
        return es(n, t, "monthsShort")
    }, t.weekdaysMin = function(n, t, i) {
        return wf(n, t, i, "weekdaysMin")
    }, t.defineLocale = tf, t.updateLocale = function(n, t) {
        var u, i, r;
        return null != t ? (r = ke, null != a[n] && null != a[n].parentLocale ? a[n].set(cu(a[n]._config, t)) : (null != (i = kr(n)) && (r = i._config), t = cu(r, t), null == i && (t.abbr = n), (u = new lu(t)).parentLocale = a[n], a[n] = u), gt(n)) : null != a[n] && (null != a[n].parentLocale ? (a[n] = a[n].parentLocale, n === gt() && gt(n)) : null != a[n] && delete a[n]), a[n]
    }, t.locales = function() {
        return te(a)
    }, t.weekdaysShort = function(n, t, i) {
        return wf(n, t, i, "weekdaysShort")
    }, t.normalizeUnits = tt, t.relativeTimeRounding = function(n) {
        return void 0 === n ? kt : "function" == typeof n && (kt = n, !0)
    }, t.relativeTimeThreshold = function(n, t) {
        return void 0 !== ai[n] && (void 0 === t ? ai[n] : (ai[n] = t, "s" === n && (ai.ss = t - 1), !0))
    }, t.calendarFormat = function(n, t) {
        var i = n.diff(t, "days", !0);
        return i < -6 ? "sameElse" : i < -1 ? "lastWeek" : i < 0 ? "lastDay" : i < 1 ? "sameDay" : i < 2 ? "nextDay" : i < 7 ? "nextWeek" : "sameElse"
    }, t.prototype = n, t.HTML5_FMT = {
        DATETIME_LOCAL: "YYYY-MM-DDTHH:mm",
        DATETIME_LOCAL_SECONDS: "YYYY-MM-DDTHH:mm:ss",
        DATETIME_LOCAL_MS: "YYYY-MM-DDTHH:mm:ss.SSS",
        DATE: "YYYY-MM-DD",
        TIME: "HH:mm",
        TIME_SECONDS: "HH:mm:ss",
        TIME_MS: "HH:mm:ss.SSS",
        WEEK: "GGGG-[W]WW",
        MONTH: "YYYY-MM"
    }, t
});
jQuery.fn.highlight = function(n) {
    function t(n, i) {
        var o = 0,
            e, u, r;
        if (n.nodeType == 3) {
            if (e = n.data.toUpperCase().indexOf(i), e >= 0) {
                u = document.createElement("span");
                u.className = "highlight";
                var f = n.splitText(e),
                    h = f.splitText(i.length),
                    s = f.cloneNode(!0);
                u.appendChild(s);
                f.parentNode.replaceChild(u, f);
                o = 1
            }
        } else if (n.nodeType == 1 && n.childNodes && !/(script|style)/i.test(n.tagName))
            for (r = 0; r < n.childNodes.length; ++r) r += t(n.childNodes[r], i);
        return o
    }
    return this.length && n && n.length ? this.each(function() {
        t(this, n.toUpperCase())
    }) : this
};
jQuery.fn.removeHighlight = function() {
    return this.find("span.highlight").each(function() {
        this.parentNode.firstChild.nodeName;
        with(this.parentNode) replaceChild(this.firstChild, this), normalize()
    }).end()
};
/*!
 * jquery-timepicker v1.11.15 - A jQuery timepicker plugin inspired by Google Calendar. It supports both mouse and keyboard navigation.
 * Copyright (c) 2015 Jon Thornton - http://jonthornton.github.com/jquery-timepicker/
 * License: MIT
 */
(function(n) {
    typeof exports == "object" && exports && typeof module == "object" && module && module.exports === exports ? n(require("jquery")) : typeof define == "function" && define.amd ? define(["jquery"], n) : n(jQuery)
})(function(n) {
    function e(n) {
        var t = n[0];
        return t.offsetWidth > 0 && t.offsetHeight > 0
    }

    function d(t) {
        var u, r;
        if (t.minTime && (t.minTime = i(t.minTime)), t.maxTime && (t.maxTime = i(t.maxTime)), t.durationTime && typeof t.durationTime != "function" && (t.durationTime = i(t.durationTime)), t.scrollDefault == "now" ? t.scrollDefault = function() {
                return t.roundingFunction(i(new Date), t)
            } : t.scrollDefault && typeof t.scrollDefault != "function" ? (u = t.scrollDefault, t.scrollDefault = function() {
                return t.roundingFunction(i(u), t)
            }) : t.minTime && (t.scrollDefault = function() {
                return t.roundingFunction(t.minTime, t)
            }), n.type(t.timeFormat) === "string" && t.timeFormat.match(/[gh]/) && (t._twelveHourTime = !0), t.showOnFocus === !1 && t.showOn.indexOf("focus") != -1 && t.showOn.splice(t.showOn.indexOf("focus"), 1), t.disableTimeRanges.length > 0) {
            for (r in t.disableTimeRanges) t.disableTimeRanges[r] = [i(t.disableTimeRanges[r][0]), i(t.disableTimeRanges[r][1])];
            for (t.disableTimeRanges = t.disableTimeRanges.sort(function(n, t) {
                    return n[0] - t[0]
                }), r = t.disableTimeRanges.length - 1; r > 0; r--) t.disableTimeRanges[r][0] <= t.disableTimeRanges[r - 1][1] && (t.disableTimeRanges[r - 1] = [Math.min(t.disableTimeRanges[r][0], t.disableTimeRanges[r - 1][0]), Math.max(t.disableTimeRanges[r][1], t.disableTimeRanges[r - 1][1])], t.disableTimeRanges.splice(r, 1))
        }
        return t
    }

    function l(t) {
        var e = t.data("timepicker-settings"),
            s = t.data("timepicker-list"),
            l, it, lt, ut, ft, k, v, st, w, et, c, ht, ct, p;
        if (s && s.length && (s.remove(), t.data("timepicker-list", !1)), e.useSelect ? (s = n("<select />", {
                "class": "ui-timepicker-select"
            }), t.attr("name") && s.attr("name", "ui-timepicker-" + t.attr("name")), l = s) : (s = n("<ul />", {
                "class": "ui-timepicker-list"
            }), l = n("<div />", {
                "class": "ui-timepicker-wrapper",
                tabindex: -1
            }), l.css({
                display: "none",
                position: "absolute"
            }).append(s)), e.noneOption)
            if (e.noneOption === !0 && (e.noneOption = e.useSelect ? "Time..." : "None"), n.isArray(e.noneOption))
                for (v in e.noneOption) parseInt(v, 10) == v && (it = g(e.noneOption[v], e.useSelect), s.append(it));
            else it = g(e.noneOption, e.useSelect), s.append(it);
        e.className && l.addClass(e.className);
        (e.minTime !== null || e.durationTime !== null) && e.showDuration && (lt = typeof e.step == "function" ? "function" : e.step, l.addClass("ui-timepicker-with-duration"), l.addClass("ui-timepicker-step-" + e.step));
        ut = e.minTime;
        typeof e.durationTime == "function" ? ut = i(e.durationTime()) : e.durationTime !== null && (ut = e.durationTime);
        ft = e.minTime !== null ? e.minTime : 0;
        k = e.maxTime !== null ? e.maxTime : ft + r - 1;
        k < ft && (k += r);
        k === r - 1 && n.type(e.timeFormat) === "string" && e.show2400 && (k = r);
        var tt = e.disableTimeRanges,
            d = 0,
            at = tt.length,
            ot = e.step;
        for (typeof ot != "function" && (ot = function() {
                return e.step
            }), v = ft, st = 0; v <= k; st++, v += ot(st) * 60) w = v, et = h(w, e), e.useSelect ? (c = n("<option />", {
            value: et
        }), c.text(et)) : (c = n("<li />"), c.addClass(w % r < r / 2 ? "ui-timepicker-am" : "ui-timepicker-pm"), c.data("time", nt(w, e)), c.text(et)), (e.minTime !== null || e.durationTime !== null) && e.showDuration && (ht = rt(v - ut, e.step), e.useSelect ? c.text(c.text() + " (" + ht + ")") : (ct = n("<span />", {
            "class": "ui-timepicker-duration"
        }), ct.text(" (" + ht + ")"), c.append(ct))), d < at && (w >= tt[d][1] && (d += 1), tt[d] && w >= tt[d][0] && w < tt[d][1] && (e.useSelect ? c.prop("disabled", !0) : c.addClass("ui-timepicker-disabled"))), s.append(c);
        if (l.data("timepicker-input", t), t.data("timepicker-list", l), e.useSelect) {
            t.val() && s.val(a(i(t.val()), e));
            s.on("focus", function() {
                n(this).data("timepicker-input").trigger("showTimepicker")
            });
            s.on("blur", function() {
                n(this).data("timepicker-input").trigger("hideTimepicker")
            });
            s.on("change", function() {
                f(t, n(this).val(), "select")
            });
            f(t, s.val(), "initial");
            t.hide().after(s)
        } else {
            p = e.appendTo;
            typeof p == "string" ? p = n(p) : typeof p == "function" && (p = p(t));
            p.append(l);
            o(t, s);
            s.on("mousedown click", "li", function() {
                t.off("focus.timepicker");
                t.on("focus.timepicker-ie-hack", function() {
                    t.off("focus.timepicker-ie-hack");
                    t.on("focus.timepicker", u.show)
                });
                if (y(t) || t[0].focus(), s.find("li").removeClass("ui-timepicker-selected"), n(this).addClass("ui-timepicker-selected"), b(t)) {
                    t.trigger("hideTimepicker");
                    s.on("mouseup.timepicker click.timepicker", "li", function() {
                        s.off("mouseup.timepicker click.timepicker");
                        l.hide()
                    })
                }
            })
        }
    }

    function g(t, i) {
        var r, f, u;
        return typeof t == "object" ? (r = t.label, f = t.className, u = t.value) : typeof t == "string" ? (r = t, u = "") : n.error("Invalid noneOption value"), i ? n("<option />", {
            value: u,
            "class": f,
            text: r
        }) : n("<li />", {
            "class": f,
            text: r
        }).data("time", String(u))
    }

    function a(n, t) {
        return n = t.roundingFunction(n, t), n !== null ? h(n, t) : void 0
    }

    function v(t) {
        if (t.target != window) {
            var i = n(t.target);
            i.closest(".ui-timepicker-input").length || i.closest(".ui-timepicker-wrapper").length || (u.hide(), n(document).unbind(".ui-timepicker"), n(window).unbind(".ui-timepicker"))
        }
    }

    function y(n) {
        var t = n.data("timepicker-settings");
        return (window.navigator.msMaxTouchPoints || "ontouchstart" in document) && t.disableTouchKeyboard
    }

    function p(t, i, r) {
        if (!r && r !== 0) return !1;
        var u = t.data("timepicker-settings"),
            f = !1,
            r = u.roundingFunction(r, u);
        return i.find("li").each(function(t, i) {
            var u = n(i);
            if (typeof u.data("time") == "number") return u.data("time") == r ? (f = u, !1) : void 0
        }), f
    }

    function o(n, t) {
        var f, u, r, e;
        (t.find("li").removeClass("ui-timepicker-selected"), f = n.data("timepicker-settings"), u = i(c(n), f), u !== null) && (r = p(n, t, u), r && (e = r.offset().top - t.offset().top, (e + r.outerHeight() > t.outerHeight() || e < 0) && t.scrollTop(t.scrollTop() + r.position().top - r.outerHeight()), (f.forceRoundTime || r.data("time") === u) && r.addClass("ui-timepicker-selected")))
    }

    function s(t, r) {
        var o, u, e, s, c, l;
        if (r != "timepicker") {
            if (o = n(this), this.value === "") {
                f(o, null, r);
                return
            }
            if (!o.is(":focus") || t && t.type == "change") {
                if (u = o.data("timepicker-settings"), e = i(this.value, u), e === null) {
                    o.trigger("timeFormatError");
                    return
                }
                s = !1;
                u.minTime !== null && u.maxTime !== null && (e < u.minTime || e > u.maxTime) && (s = !0);
                n.each(u.disableTimeRanges, function() {
                    if (e >= this[0] && e < this[1]) return s = !0, !1
                });
                u.forceRoundTime && (c = u.roundingFunction(e, u), c != e && (e = c, r = null));
                l = h(e, u);
                s ? (f(o, l, "error") || t && t.type == "change") && o.trigger("timeRangeError") : f(o, l, r)
            }
        }
    }

    function c(n) {
        return n.is("input") ? n.val() : n.data("ui-timepicker-value")
    }

    function f(n, t, r) {
        if (n.is("input")) {
            n.val(t);
            var u = n.data("timepicker-settings");
            u.useSelect && r != "select" && n.data("timepicker-list") && n.data("timepicker-list").val(a(i(t), u))
        }
        return n.data("ui-timepicker-value") != t ? (n.data("ui-timepicker-value", t), r == "select" ? n.trigger("selectTime").trigger("changeTime").trigger("change", "timepicker") : ["error", "initial"].indexOf(r) == -1 && n.trigger("changeTime"), !0) : (["error", "initial"].indexOf(r) == -1 && n.trigger("selectTime"), !1)
    }

    function tt(n) {
        switch (n.keyCode) {
            case 13:
            case 9:
                return;
            default:
                n.preventDefault()
        }
    }

    function it(t) {
        var f = n(this),
            r = f.data("timepicker-list"),
            i;
        if (!r || !e(r))
            if (t.keyCode == 40) u.show.call(f.get(0)), r = f.data("timepicker-list"), y(f) || f.focus();
            else return !0;
        switch (t.keyCode) {
            case 13:
                return b(f) && (s.call(f.get(0), {
                    type: "change"
                }), u.hide.apply(this)), t.preventDefault(), !1;
            case 38:
                return i = r.find(".ui-timepicker-selected"), i.length ? i.is(":first-child") || (i.removeClass("ui-timepicker-selected"), i.prev().addClass("ui-timepicker-selected"), i.prev().position().top < i.outerHeight() && r.scrollTop(r.scrollTop() - i.outerHeight())) : (r.find("li").each(function(t, r) {
                    if (n(r).position().top > 0) return i = n(r), !1
                }), i.addClass("ui-timepicker-selected")), !1;
            case 40:
                return i = r.find(".ui-timepicker-selected"), i.length === 0 ? (r.find("li").each(function(t, r) {
                    if (n(r).position().top > 0) return i = n(r), !1
                }), i.addClass("ui-timepicker-selected")) : i.is(":last-child") || (i.removeClass("ui-timepicker-selected"), i.next().addClass("ui-timepicker-selected"), i.next().position().top + 2 * i.outerHeight() > r.outerHeight() && r.scrollTop(r.scrollTop() + i.outerHeight())), !1;
            case 27:
                r.find("li").removeClass("ui-timepicker-selected");
                u.hide();
                break;
            case 9:
                u.hide();
                break;
            default:
                return !0
        }
    }

    function w(t) {
        var r = n(this),
            i = r.data("timepicker-list"),
            u = r.data("timepicker-settings");
        if (!i || !e(i) || u.disableTextInput) return !0;
        if (t.type === "paste" || t.type === "cut") {
            setTimeout(function() {
                u.typeaheadHighlight ? o(r, i) : i.hide()
            }, 0);
            return
        }
        switch (t.keyCode) {
            case 96:
            case 97:
            case 98:
            case 99:
            case 100:
            case 101:
            case 102:
            case 103:
            case 104:
            case 105:
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
            case 65:
            case 77:
            case 80:
            case 186:
            case 8:
            case 46:
                u.typeaheadHighlight ? o(r, i) : i.hide()
        }
    }

    function b(n) {
        var r = n.data("timepicker-settings"),
            u = n.data("timepicker-list"),
            t = null,
            i = u.find(".ui-timepicker-selected");
        return i.hasClass("ui-timepicker-disabled") ? !1 : (i.length && (t = i.data("time")), t !== null && (typeof t != "string" && (t = h(t, r)), f(n, t, "select")), !0)
    }

    function rt(n, i) {
        n = Math.abs(n);
        var u = Math.round(n / 60),
            r = [],
            f, e;
        return u < 60 ? r = [u, t.mins] : (f = Math.floor(u / 60), e = u % 60, i == 30 && e == 30 && (f += t.decimal + 5), r.push(f), r.push(f == 1 ? t.hr : t.hrs), i != 30 && e && (r.push(e), r.push(t.mins))), r.join(" ")
    }

    function h(i, u) {
        var e, f, l, s, c;
        if (typeof i != "number") return null;
        var h = parseInt(i % 60),
            c = parseInt(i / 60 % 60),
            a = parseInt(i / 3600 % 24),
            o = new Date(1970, 0, 2, a, c, h, 0);
        if (isNaN(o.getTime())) return null;
        if (n.type(u.timeFormat) === "function") return u.timeFormat(o);
        for (e = "", s = 0; s < u.timeFormat.length; s++) {
            l = u.timeFormat.charAt(s);
            switch (l) {
                case "a":
                    e += o.getHours() > 11 ? t.pm : t.am;
                    break;
                case "A":
                    e += o.getHours() > 11 ? t.PM : t.AM;
                    break;
                case "g":
                    f = o.getHours() % 12;
                    e += f === 0 ? "12" : f;
                    break;
                case "G":
                    f = o.getHours();
                    i === r && (f = u.show2400 ? 24 : 0);
                    e += f;
                    break;
                case "h":
                    f = o.getHours() % 12;
                    f !== 0 && f < 10 && (f = "0" + f);
                    e += f === 0 ? "12" : f;
                    break;
                case "H":
                    f = o.getHours();
                    i === r && (f = u.show2400 ? 24 : 0);
                    e += f > 9 ? f : "0" + f;
                    break;
                case "i":
                    c = o.getMinutes();
                    e += c > 9 ? c : "0" + c;
                    break;
                case "s":
                    h = o.getSeconds();
                    e += h > 9 ? h : "0" + h;
                    break;
                case "\\":
                    s++;
                    e += u.timeFormat.charAt(s);
                    break;
                default:
                    e += l
            }
        }
        return e
    }

    function i(n, i) {
        var h, y, e, c;
        if (n === "" || n === null) return null;
        if (typeof n == "object") return n.getHours() * 3600 + n.getMinutes() * 60 + n.getSeconds();
        if (typeof n != "string") return n;
        n = n.toLowerCase().replace(/[\s\.]/g, "");
        (n.slice(-1) == "a" || n.slice(-1) == "p") && (n += "m");
        var l = "(" + t.am.replace(".", "") + "|" + t.pm.replace(".", "") + "|" + t.AM.replace(".", "") + "|" + t.PM.replace(".", "") + ")?",
            p = new RegExp("^" + l + "([0-9]?[0-9])\\W?([0-5][0-9])?\\W?([0-5][0-9])?" + l + "$"),
            f = n.match(p);
        if (!f) return null;
        var u = parseInt(f[2] * 1, 10),
            o = f[1] || f[5],
            s = u,
            a = f[3] * 1 || 0,
            v = f[4] * 1 || 0;
        if (u <= 12 && o) h = o == t.pm || o == t.PM, s = u == 12 ? h ? 12 : 0 : u + (h ? 12 : 0);
        else if (i && (y = u * 3600 + a * 60 + v, y >= r + (i.show2400 ? 1 : 0))) {
            if (i.wrapHours === !1) return null;
            s = u % 24
        }
        return e = s * 3600 + a * 60 + v, u < 12 && !o && i && i._twelveHourTime && i.scrollDefault && (c = e - i.scrollDefault(), c < 0 && c >= r / -2 && (e = (e + r / 2) % r)), e
    }

    function nt(n, t) {
        return n == r && t.show2400 ? n : n % r
    }
    var r = 86400,
        t = {
            am: "am",
            pm: "pm",
            AM: "AM",
            PM: "PM",
            decimal: ".",
            mins: "mins",
            hr: "hr",
            hrs: "hrs"
        },
        k = {
            appendTo: "body",
            className: null,
            closeOnWindowScroll: !1,
            disableTextInput: !1,
            disableTimeRanges: [],
            disableTouchKeyboard: !1,
            durationTime: null,
            forceRoundTime: !1,
            maxTime: null,
            minTime: null,
            noneOption: !1,
            orientation: "l",
            roundingFunction: function(n, t) {
                if (n === null) return null;
                if (typeof t.step != "number") return n;
                var i = n % (t.step * 60),
                    r = t.minTime || 0;
                return i -= r % (t.step * 60), i >= t.step * 30 ? n += t.step * 60 - i : n -= i, nt(n, t)
            },
            scrollDefault: null,
            selectOnBlur: !1,
            show2400: !1,
            showDuration: !1,
            showOn: ["click", "focus"],
            showOnFocus: !0,
            step: 30,
            stopScrollPropagation: !1,
            timeFormat: "g:ia",
            typeaheadHighlight: !0,
            useSelect: !1,
            wrapHours: !0
        },
        u = {
            init: function(i) {
                return this.each(function() {
                    var r = n(this),
                        o = [],
                        e, f, h;
                    for (e in k) r.data(e) && (o[e] = r.data(e));
                    if (f = n.extend({}, k, i, o), f.lang && (t = n.extend(t, f.lang)), f = d(f), r.data("timepicker-settings", f), r.addClass("ui-timepicker-input"), f.useSelect) l(r);
                    else {
                        if (r.prop("autocomplete", "off"), f.showOn)
                            for (h in f.showOn) r.on(f.showOn[h] + ".timepicker", u.show);
                        r.on("change.timepicker", s);
                        r.on("keydown.timepicker", it);
                        r.on("keyup.timepicker", w);
                        if (f.disableTextInput) r.on("keydown.timepicker", tt);
                        r.on("cut.timepicker", w);
                        r.on("paste.timepicker", w);
                        s.call(r.get(0), null, "initial")
                    }
                })
            },
            show: function(t) {
                var f = n(this),
                    h = f.data("timepicker-settings"),
                    r, a, b, s, w, k;
                if (t && t.preventDefault(), h.useSelect) {
                    f.data("timepicker-list").focus();
                    return
                }
                if ((y(f) && f.blur(), r = f.data("timepicker-list"), !f.prop("readonly")) && (r && r.length !== 0 && typeof h.durationTime != "function" || (l(f), r = f.data("timepicker-list")), !e(r))) {
                    if (f.data("ui-timepicker-value", f.val()), o(f, r), u.hide(), r.show(), a = {}, a.left = h.orientation.match(/r/) ? f.offset().left + f.outerWidth() - r.outerWidth() + parseInt(r.css("marginLeft").replace("px", ""), 10) : f.offset().left + parseInt(r.css("marginLeft").replace("px", ""), 10), b = h.orientation.match(/t/) ? "t" : h.orientation.match(/b/) ? "b" : f.offset().top + f.outerHeight(!0) + r.outerHeight() > n(window).height() + n(window).scrollTop() ? "t" : "b", b == "t" ? (r.addClass("ui-timepicker-positioned-top"), a.top = f.offset().top - r.outerHeight() + parseInt(r.css("marginTop").replace("px", ""), 10)) : (r.removeClass("ui-timepicker-positioned-top"), a.top = f.offset().top + f.outerHeight() + parseInt(r.css("marginTop").replace("px", ""), 10)), r.offset(a), s = r.find(".ui-timepicker-selected"), s.length || (w = i(c(f)), w !== null ? s = p(f, r, w) : h.scrollDefault && (s = p(f, r, h.scrollDefault()))), (!s.length || s.hasClass("ui-timepicker-disabled")) && (s = r.find("li:not(.ui-timepicker-disabled):first")), s && s.length ? (k = r.scrollTop() + s.position().top - s.outerHeight(), r.scrollTop(k)) : r.scrollTop(0), h.stopScrollPropagation) n(document).on("wheel.ui-timepicker", ".ui-timepicker-wrapper", function(t) {
                        t.preventDefault();
                        var i = n(this).scrollTop();
                        n(this).scrollTop(i + t.originalEvent.deltaY)
                    });
                    n(document).on("touchstart.ui-timepicker mousedown.ui-timepicker", v);
                    n(window).on("resize.ui-timepicker", v);
                    if (h.closeOnWindowScroll) n(document).on("scroll.ui-timepicker", v);
                    return f.trigger("showTimepicker"), this
                }
            },
            hide: function() {
                var t = n(this),
                    i = t.data("timepicker-settings");
                return i && i.useSelect && t.blur(), n(".ui-timepicker-wrapper").each(function() {
                    var i = n(this),
                        t, r;
                    e(i) && (t = i.data("timepicker-input"), r = t.data("timepicker-settings"), r && r.selectOnBlur && b(t), i.hide(), t.trigger("hideTimepicker"))
                }), this
            },
            option: function(t, i) {
                return typeof t == "string" && typeof i == "undefined" ? n(this).data("timepicker-settings")[t] : this.each(function() {
                    var u = n(this),
                        r = u.data("timepicker-settings"),
                        f = u.data("timepicker-list");
                    typeof t == "object" ? r = n.extend(r, t) : typeof t == "string" && (r[t] = i);
                    r = d(r);
                    u.data("timepicker-settings", r);
                    s.call(u.get(0), {
                        type: "change"
                    }, "initial");
                    f && (f.remove(), u.data("timepicker-list", !1));
                    r.useSelect && l(u)
                })
            },
            getSecondsFromMidnight: function() {
                return i(c(this))
            },
            getTime: function(n) {
                var f = this,
                    u = c(f),
                    r, t;
                return u ? (r = i(u), r === null) ? null : (n || (n = new Date), t = new Date(n), t.setHours(r / 3600), t.setMinutes(r % 3600 / 60), t.setSeconds(r % 60), t.setMilliseconds(0), t) : null
            },
            isVisible: function() {
                var t = this,
                    n = t.data("timepicker-list");
                return !!(n && e(n))
            },
            setTime: function(n) {
                var t = this,
                    r = t.data("timepicker-settings"),
                    u;
                return u = r.forceRoundTime ? a(i(n), r) : h(i(n), r), n && u === null && r.noneOption && (u = n), f(t, u, "initial"), s.call(t.get(0), {
                    type: "change"
                }, "initial"), t.data("timepicker-list") && o(t, t.data("timepicker-list")), this
            },
            remove: function() {
                var n = this,
                    t;
                if (n.hasClass("ui-timepicker-input")) return t = n.data("timepicker-settings"), n.removeAttr("autocomplete", "off"), n.removeClass("ui-timepicker-input"), n.removeData("timepicker-settings"), n.off(".timepicker"), n.data("timepicker-list") && n.data("timepicker-list").remove(), t.useSelect && n.show(), n.removeData("timepicker-list"), this
            }
        };
    n.fn.timepicker = function(t) {
        if (!this.length) return this;
        if (u[t]) return this.hasClass("ui-timepicker-input") ? u[t].apply(this, Array.prototype.slice.call(arguments, 1)) : this;
        if (typeof t != "object" && t) n.error("Method " + t + " does not exist on jQuery.timepicker");
        else return u.init.apply(this, arguments)
    }
});
/*! Datepicker for Bootstrap v1.4.0 (https://github.com/eternicode/bootstrap-datepicker) */
(function(n, t) {
    function u() {
        return new Date(Date.UTC.apply(Date, arguments))
    }

    function e() {
        var n = new Date;
        return u(n.getFullYear(), n.getMonth(), n.getDate())
    }

    function y(n, t) {
        return n.getUTCFullYear() === t.getUTCFullYear() && n.getUTCMonth() === t.getUTCMonth() && n.getUTCDate() === t.getUTCDate()
    }

    function c(n) {
        return function() {
            return this[n].apply(this, arguments)
        }
    }

    function p(t, i) {
        function s(n, t) {
            return t.toLowerCase()
        }
        var u = n(t).data(),
            f = {},
            e, o = new RegExp("^" + i.toLowerCase() + "([A-Z])"),
            r;
        i = new RegExp("^" + i.toLowerCase());
        for (r in u) i.test(r) && (e = r.replace(o, s), f[e] = u[r]);
        return f
    }

    function w(t) {
        var u = {},
            i;
        if (r[t] || (t = t.split("-")[0], r[t])) return i = r[t], n.each(v, function(n, t) {
            t in i && (u[t] = i[t])
        }), u
    }
    var l = function() {
            var t = {
                get: function(n) {
                    return this.slice(n)[0]
                },
                contains: function(n) {
                    for (var i = n && n.valueOf(), t = 0, r = this.length; t < r; t++)
                        if (this[t].valueOf() === i) return t;
                    return -1
                },
                remove: function(n) {
                    this.splice(n, 1)
                },
                replace: function(t) {
                    t && (n.isArray(t) || (t = [t]), this.clear(), this.push.apply(this, t))
                },
                clear: function() {
                    this.length = 0
                },
                copy: function() {
                    var n = new l;
                    return n.replace(this), n
                }
            };
            return function() {
                var i = [];
                return i.push.apply(i, arguments), n.extend(i, t), i
            }
        }(),
        f = function(t, r) {
            this._process_options(r);
            this.dates = new l;
            this.viewDate = this.o.defaultViewDate;
            this.focusDate = null;
            this.element = n(t);
            this.isInline = !1;
            this.isInput = this.element.is("input");
            this.component = this.element.hasClass("date") ? this.element.find(".add-on, .input-group-addon, .btn") : !1;
            this.hasInput = this.component && this.element.find("input").length;
            this.component && this.component.length === 0 && (this.component = !1);
            this.picker = n(i.template);
            this._buildEvents();
            this._attachEvents();
            this.isInline ? this.picker.addClass("datepicker-inline").appendTo(this.element) : this.picker.addClass("datepicker-dropdown dropdown-menu");
            this.o.rtl && this.picker.addClass("datepicker-rtl");
            this.viewMode = this.o.startView;
            this.o.calendarWeeks && this.picker.find("tfoot .today, tfoot .clear").attr("colspan", function(n, t) {
                return parseInt(t) + 1
            });
            this._allow_update = !1;
            this.setStartDate(this._o.startDate);
            this.setEndDate(this._o.endDate);
            this.setDaysOfWeekDisabled(this.o.daysOfWeekDisabled);
            this.setDatesDisabled(this.o.datesDisabled);
            this.fillDow();
            this.fillMonths();
            this._allow_update = !0;
            this.update();
            this.showMode();
            this.isInline && this.show()
        },
        h, a, o, s, v, r, i;
    f.prototype = {
        constructor: f,
        _process_options: function(f) {
            var o, c, a, v, h, l;
            this._o = n.extend({}, this._o, f);
            o = this.o = n.extend({}, this._o);
            c = o.language;
            r[c] || (c = c.split("-")[0], r[c] || (c = s.language));
            o.language = c;
            switch (o.startView) {
                case 2:
                case "decade":
                    o.startView = 2;
                    break;
                case 1:
                case "year":
                    o.startView = 1;
                    break;
                default:
                    o.startView = 0
            }
            switch (o.minViewMode) {
                case 1:
                case "months":
                    o.minViewMode = 1;
                    break;
                case 2:
                case "years":
                    o.minViewMode = 2;
                    break;
                default:
                    o.minViewMode = 0
            }
            if (o.startView = Math.max(o.startView, o.minViewMode), o.multidate !== !0 && (o.multidate = Number(o.multidate) || !1, o.multidate !== !1 && (o.multidate = Math.max(0, o.multidate))), o.multidateSeparator = String(o.multidateSeparator), o.weekStart %= 7, o.weekEnd = (o.weekStart + 6) % 7, a = i.parseFormat(o.format), o.startDate !== -Infinity && (o.startDate = o.startDate ? o.startDate instanceof Date ? this._local_to_utc(this._zero_time(o.startDate)) : i.parseDate(o.startDate, a, o.language) : -Infinity), o.endDate !== Infinity && (o.endDate = o.endDate ? o.endDate instanceof Date ? this._local_to_utc(this._zero_time(o.endDate)) : i.parseDate(o.endDate, a, o.language) : Infinity), o.daysOfWeekDisabled = o.daysOfWeekDisabled || [], n.isArray(o.daysOfWeekDisabled) || (o.daysOfWeekDisabled = o.daysOfWeekDisabled.split(/[,\s]*/)), o.daysOfWeekDisabled = n.map(o.daysOfWeekDisabled, function(n) {
                    return parseInt(n, 10)
                }), o.datesDisabled = o.datesDisabled || [], n.isArray(o.datesDisabled) || (v = [], v.push(i.parseDate(o.datesDisabled, a, o.language)), o.datesDisabled = v), o.datesDisabled = n.map(o.datesDisabled, function(n) {
                    return i.parseDate(n, a, o.language)
                }), h = String(o.orientation).toLowerCase().split(/\s+/g), l = o.orientation.toLowerCase(), h = n.grep(h, function(n) {
                    return /^auto|left|right|top|bottom$/.test(n)
                }), o.orientation = {
                    x: "auto",
                    y: "auto"
                }, l && l !== "auto")
                if (h.length === 1) switch (h[0]) {
                    case "top":
                    case "bottom":
                        o.orientation.y = h[0];
                        break;
                    case "left":
                    case "right":
                        o.orientation.x = h[0]
                } else l = n.grep(h, function(n) {
                    return /^left|right$/.test(n)
                }), o.orientation.x = l[0] || "auto", l = n.grep(h, function(n) {
                    return /^top|bottom$/.test(n)
                }), o.orientation.y = l[0] || "auto";
            if (o.defaultViewDate) {
                var y = o.defaultViewDate.year || (new Date).getFullYear(),
                    p = o.defaultViewDate.month || 0,
                    w = o.defaultViewDate.day || 1;
                o.defaultViewDate = u(y, p, w)
            } else o.defaultViewDate = e();
            o.showOnFocus = o.showOnFocus !== t ? o.showOnFocus : !0
        },
        _events: [],
        _secondaryEvents: [],
        _applyEvents: function(n) {
            for (var i = 0, f, r, u; i < n.length; i++) {
                f = n[i][0];
                n[i].length === 2 ? (r = t, u = n[i][1]) : n[i].length === 3 && (r = n[i][1], u = n[i][2]);
                f.on(u, r)
            }
        },
        _unapplyEvents: function(n) {
            for (var i = 0, f, r, u; i < n.length; i++) f = n[i][0], n[i].length === 2 ? (u = t, r = n[i][1]) : n[i].length === 3 && (u = n[i][1], r = n[i][2]), f.off(r, u)
        },
        _buildEvents: function() {
            var t = {
                keyup: n.proxy(function(t) {
                    n.inArray(t.keyCode, [27, 37, 39, 38, 40, 32, 13, 9]) === -1 && this.update()
                }, this),
                keydown: n.proxy(this.keydown, this)
            };
            this.o.showOnFocus === !0 && (t.focus = n.proxy(this.show, this));
            this.isInput ? this._events = [
                [this.element, t]
            ] : this.component && this.hasInput ? this._events = [
                [this.element.find("input"), t],
                [this.component, {
                    click: n.proxy(this.show, this)
                }]
            ] : this.element.is("div") ? this.isInline = !0 : this._events = [
                [this.element, {
                    click: n.proxy(this.show, this)
                }]
            ];
            this._events.push([this.element, "*", {
                blur: n.proxy(function(n) {
                    this._focused_from = n.target
                }, this)
            }], [this.element, {
                blur: n.proxy(function(n) {
                    this._focused_from = n.target
                }, this)
            }]);
            this._secondaryEvents = [
                [this.picker, {
                    click: n.proxy(this.click, this)
                }],
                [n(window), {
                    resize: n.proxy(this.place, this)
                }],
                [n(document), {
                    "mousedown touchstart": n.proxy(function(n) {
                        this.element.is(n.target) || this.element.find(n.target).length || this.picker.is(n.target) || this.picker.find(n.target).length || this.hide()
                    }, this)
                }]
            ]
        },
        _attachEvents: function() {
            this._detachEvents();
            this._applyEvents(this._events)
        },
        _detachEvents: function() {
            this._unapplyEvents(this._events)
        },
        _attachSecondaryEvents: function() {
            this._detachSecondaryEvents();
            this._applyEvents(this._secondaryEvents)
        },
        _detachSecondaryEvents: function() {
            this._unapplyEvents(this._secondaryEvents)
        },
        _trigger: function(t, r) {
            var u = r || this.dates.get(-1),
                f = this._utc_to_local(u);
            this.element.trigger({
                type: t,
                date: f,
                dates: n.map(this.dates, this._utc_to_local),
                format: n.proxy(function(n, t) {
                    arguments.length === 0 ? (n = this.dates.length - 1, t = this.o.format) : typeof n == "string" && (t = n, n = this.dates.length - 1);
                    t = t || this.o.format;
                    var r = this.dates.get(n);
                    return i.formatDate(r, t, this.o.language)
                }, this)
            })
        },
        show: function() {
            if (!this.element.attr("readonly") || this.o.enableOnReadonly !== !1) return this.isInline || this.picker.appendTo(this.o.container), this.place(), this.picker.show(), this._attachSecondaryEvents(), this._trigger("show"), (window.navigator.msMaxTouchPoints || "ontouchstart" in document) && this.o.disableTouchKeyboard && n(this.element).blur(), this
        },
        hide: function() {
            return this.isInline ? this : this.picker.is(":visible") ? (this.focusDate = null, this.picker.hide().detach(), this._detachSecondaryEvents(), this.viewMode = this.o.startView, this.showMode(), this.o.forceParse && (this.isInput && this.element.val() || this.hasInput && this.element.find("input").val()) && this.setValue(), this._trigger("hide"), this) : this
        },
        remove: function() {
            return this.hide(), this._detachEvents(), this._detachSecondaryEvents(), this.picker.remove(), delete this.element.data().datepicker, this.isInput || delete this.element.data().date, this
        },
        _utc_to_local: function(n) {
            return n && new Date(n.getTime() + n.getTimezoneOffset() * 6e4)
        },
        _local_to_utc: function(n) {
            return n && new Date(n.getTime() - n.getTimezoneOffset() * 6e4)
        },
        _zero_time: function(n) {
            return n && new Date(n.getFullYear(), n.getMonth(), n.getDate())
        },
        _zero_utc_time: function(n) {
            return n && new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate()))
        },
        getDates: function() {
            return n.map(this.dates, this._utc_to_local)
        },
        getUTCDates: function() {
            return n.map(this.dates, function(n) {
                return new Date(n)
            })
        },
        getDate: function() {
            return this._utc_to_local(this.getUTCDate())
        },
        getUTCDate: function() {
            var n = this.dates.get(-1);
            return typeof n != "undefined" ? new Date(n) : null
        },
        clearDates: function() {
            var n;
            this.isInput ? n = this.element : this.component && (n = this.element.find("input"));
            n && n.val("").change();
            this.update();
            this._trigger("changeDate");
            this.o.autoclose && this.hide()
        },
        setDates: function() {
            var t = n.isArray(arguments[0]) ? arguments[0] : arguments;
            return this.update.apply(this, t), this._trigger("changeDate"), this.setValue(), this
        },
        setUTCDates: function() {
            var t = n.isArray(arguments[0]) ? arguments[0] : arguments;
            return this.update.apply(this, n.map(t, this._utc_to_local)), this._trigger("changeDate"), this.setValue(), this
        },
        setDate: c("setDates"),
        setUTCDate: c("setUTCDates"),
        setValue: function() {
            var n = this.getFormattedDate();
            return this.isInput ? this.element.val(n).change() : this.component && this.element.find("input").val(n).change(), this
        },
        getFormattedDate: function(r) {
            r === t && (r = this.o.format);
            var u = this.o.language;
            return n.map(this.dates, function(n) {
                return i.formatDate(n, r, u)
            }).join(this.o.multidateSeparator)
        },
        setStartDate: function(n) {
            return this._process_options({
                startDate: n
            }), this.update(), this.updateNavArrows(), this
        },
        setEndDate: function(n) {
            return this._process_options({
                endDate: n
            }), this.update(), this.updateNavArrows(), this
        },
        setDaysOfWeekDisabled: function(n) {
            return this._process_options({
                daysOfWeekDisabled: n
            }), this.update(), this.updateNavArrows(), this
        },
        setDatesDisabled: function(n) {
            this._process_options({
                datesDisabled: n
            });
            this.update();
            this.updateNavArrows()
        },
        place: function() {
            var u, p, s, w;
            if (this.isInline) return this;
            var f = this.picker.outerWidth(),
                e = this.picker.outerHeight(),
                h = n(this.o.container).width(),
                b = n(this.o.container).height(),
                c = n(this.o.container).scrollTop(),
                l = n(this.o.container).offset(),
                a = [];
            this.element.parents().each(function() {
                var t = n(this).css("z-index");
                t !== "auto" && t !== 0 && a.push(parseInt(t))
            });
            var v = Math.max.apply(Math, a) + 10,
                r = this.component ? this.component.parent().offset() : this.element.offset(),
                y = this.component ? this.component.outerHeight(!0) : this.element.outerHeight(!1),
                o = this.component ? this.component.outerWidth(!0) : this.element.outerWidth(!1),
                t = r.left - l.left,
                i = r.top - l.top;
            return this.picker.removeClass("datepicker-orient-top datepicker-orient-bottom datepicker-orient-right datepicker-orient-left"), this.o.orientation.x !== "auto" ? (this.picker.addClass("datepicker-orient-" + this.o.orientation.x), this.o.orientation.x === "right" && (t -= f - o)) : r.left < 0 ? (this.picker.addClass("datepicker-orient-left"), t -= r.left - 10) : t + f > h ? (this.picker.addClass("datepicker-orient-right"), t = r.left + o - f) : this.picker.addClass("datepicker-orient-left"), u = this.o.orientation.y, u === "auto" && (p = -c + i - e, s = c + b - (i + y + e), u = Math.max(p, s) === s ? "top" : "bottom"), this.picker.addClass("datepicker-orient-" + u), u === "top" ? i += y : i -= e + parseInt(this.picker.css("padding-top")), this.o.rtl ? (w = h - (t + o), this.picker.css({
                top: i,
                right: w,
                zIndex: v
            })) : this.picker.css({
                top: i,
                left: t,
                zIndex: v
            }), this
        },
        _allow_update: !0,
        update: function() {
            if (!this._allow_update) return this;
            var r = this.dates.copy(),
                t = [],
                u = !1;
            return arguments.length ? (n.each(arguments, n.proxy(function(n, i) {
                i instanceof Date && (i = this._local_to_utc(i));
                t.push(i)
            }, this)), u = !0) : (t = this.isInput ? this.element.val() : this.element.data("date") || this.element.find("input").val(), t = t && this.o.multidate ? t.split(this.o.multidateSeparator) : [t], delete this.element.data().date), t = n.map(t, n.proxy(function(n) {
                return i.parseDate(n, this.o.format, this.o.language)
            }, this)), t = n.grep(t, n.proxy(function(n) {
                return n < this.o.startDate || n > this.o.endDate || !n
            }, this), !0), this.dates.replace(t), this.dates.length ? this.viewDate = new Date(this.dates.get(-1)) : this.viewDate < this.o.startDate ? this.viewDate = new Date(this.o.startDate) : this.viewDate > this.o.endDate && (this.viewDate = new Date(this.o.endDate)), u ? this.setValue() : t.length && String(r) !== String(this.dates) && this._trigger("changeDate"), !this.dates.length && r.length && this._trigger("clearDate"), this.fill(), this
        },
        fillDow: function() {
            var t = this.o.weekStart,
                n = "<tr>",
                i;
            for (this.o.calendarWeeks && (this.picker.find(".datepicker-days thead tr:first-child .datepicker-switch").attr("colspan", function(n, t) {
                    return parseInt(t) + 1
                }), i = '<th class="cw">&#160;<\/th>', n += i); t < this.o.weekStart + 7;) n += '<th class="dow">' + r[this.o.language].daysMin[t++ % 7] + "<\/th>";
            n += "<\/tr>";
            this.picker.find(".datepicker-days thead").append(n)
        },
        fillMonths: function() {
            for (var n = "", t = 0; t < 12;) n += '<span class="month">' + r[this.o.language].monthsShort[t++] + "<\/span>";
            this.picker.find(".datepicker-months td").html(n)
        },
        setRange: function(t) {
            t && t.length ? this.range = n.map(t, function(n) {
                return n.valueOf()
            }) : delete this.range;
            this.fill()
        },
        getClassNames: function(t) {
            var i = [],
                r = this.viewDate.getUTCFullYear(),
                f = this.viewDate.getUTCMonth(),
                u = new Date;
            return t.getUTCFullYear() < r || t.getUTCFullYear() === r && t.getUTCMonth() < f ? i.push("old") : (t.getUTCFullYear() > r || t.getUTCFullYear() === r && t.getUTCMonth() > f) && i.push("new"), this.focusDate && t.valueOf() === this.focusDate.valueOf() && i.push("focused"), this.o.todayHighlight && t.getUTCFullYear() === u.getFullYear() && t.getUTCMonth() === u.getMonth() && t.getUTCDate() === u.getDate() && i.push("today"), this.dates.contains(t) !== -1 && i.push("active"), (t.valueOf() < this.o.startDate || t.valueOf() > this.o.endDate || n.inArray(t.getUTCDay(), this.o.daysOfWeekDisabled) !== -1) && i.push("disabled"), this.o.datesDisabled.length > 0 && n.grep(this.o.datesDisabled, function(n) {
                return y(t, n)
            }).length > 0 && i.push("disabled", "disabled-date"), this.range && (t > this.range[0] && t < this.range[this.range.length - 1] && i.push("range"), n.inArray(t.valueOf(), this.range) !== -1 && i.push("selected")), i
        },
        fill: function() {
            var g = new Date(this.viewDate),
                f = g.getUTCFullYear(),
                p = g.getUTCMonth(),
                w = this.o.startDate !== -Infinity ? this.o.startDate.getUTCFullYear() : -Infinity,
                ft = this.o.startDate !== -Infinity ? this.o.startDate.getUTCMonth() : -Infinity,
                b = this.o.endDate !== Infinity ? this.o.endDate.getUTCFullYear() : Infinity,
                et = this.o.endDate !== Infinity ? this.o.endDate.getUTCMonth() : Infinity,
                ot = r[this.o.language].today || r.en.today || "",
                st = r[this.o.language].clear || r.en.clear || "",
                y, e, k, c, s, h, o, l, it, rt, ut, a, v;
            if (!isNaN(f) && !isNaN(p)) {
                for (this.picker.find(".datepicker-days thead .datepicker-switch").text(r[this.o.language].months[p] + " " + f), this.picker.find("tfoot .today").text(ot).toggle(this.o.todayBtn !== !1), this.picker.find("tfoot .clear").text(st).toggle(this.o.clearBtn !== !1), this.updateNavArrows(), this.fillMonths(), e = u(f, p - 1, 28), k = i.getDaysInMonth(e.getUTCFullYear(), e.getUTCMonth()), e.setUTCDate(k), e.setUTCDate(k - (e.getUTCDay() - this.o.weekStart + 7) % 7), c = new Date(e), c.setUTCDate(c.getUTCDate() + 42), c = c.valueOf(), s = []; e.valueOf() < c;) {
                    if (e.getUTCDay() === this.o.weekStart && (s.push("<tr>"), this.o.calendarWeeks)) {
                        var nt = new Date(+e + (this.o.weekStart - e.getUTCDay() - 7) % 7 * 864e5),
                            tt = new Date(Number(nt) + (11 - nt.getUTCDay()) % 7 * 864e5),
                            d = new Date(Number(d = u(tt.getUTCFullYear(), 0, 1)) + (11 - d.getUTCDay()) % 7 * 864e5),
                            ht = (tt - d) / 6048e5 + 1;
                        s.push('<td class="cw">' + ht + "<\/td>")
                    }
                    h = this.getClassNames(e);
                    h.push("day");
                    this.o.beforeShowDay !== n.noop && (o = this.o.beforeShowDay(this._utc_to_local(e)), o === t ? o = {} : typeof o == "boolean" ? o = {
                        enabled: o
                    } : typeof o == "string" && (o = {
                        classes: o
                    }), o.enabled === !1 && h.push("disabled"), o.classes && (h = h.concat(o.classes.split(/\s+/))), o.tooltip && (y = o.tooltip));
                    h = n.unique(h);
                    s.push('<td class="' + h.join(" ") + '"' + (y ? ' title="' + y + '"' : "") + ">" + e.getUTCDate() + "<\/td>");
                    y = null;
                    e.getUTCDay() === this.o.weekEnd && s.push("<\/tr>");
                    e.setUTCDate(e.getUTCDate() + 1)
                }
                for (this.picker.find(".datepicker-days tbody").empty().append(s.join("")), l = this.picker.find(".datepicker-months").find("th:eq(1)").text(f).end().find("span").removeClass("active"), n.each(this.dates, function(n, t) {
                        t.getUTCFullYear() === f && l.eq(t.getUTCMonth()).addClass("active")
                    }), (f < w || f > b) && l.addClass("disabled"), f === w && l.slice(0, ft).addClass("disabled"), f === b && l.slice(et + 1).addClass("disabled"), this.o.beforeShowMonth !== n.noop && (it = this, n.each(l, function(t, i) {
                        if (!n(i).hasClass("disabled")) {
                            var r = new Date(f, t, 1),
                                u = it.o.beforeShowMonth(r);
                            u === !1 && n(i).addClass("disabled")
                        }
                    })), s = "", f = parseInt(f / 10, 10) * 10, rt = this.picker.find(".datepicker-years").find("th:eq(1)").text(f + "-" + (f + 9)).end().find("td"), f -= 1, ut = n.map(this.dates, function(n) {
                        return n.getUTCFullYear()
                    }), v = -1; v < 11; v++) a = ["year"], v === -1 ? a.push("old") : v === 10 && a.push("new"), n.inArray(f, ut) !== -1 && a.push("active"), (f < w || f > b) && a.push("disabled"), s += '<span class="' + a.join(" ") + '">' + f + "<\/span>", f += 1;
                rt.html(s)
            }
        },
        updateNavArrows: function() {
            if (this._allow_update) {
                var t = new Date(this.viewDate),
                    n = t.getUTCFullYear(),
                    i = t.getUTCMonth();
                switch (this.viewMode) {
                    case 0:
                        this.o.startDate !== -Infinity && n <= this.o.startDate.getUTCFullYear() && i <= this.o.startDate.getUTCMonth() ? this.picker.find(".prev").css({
                            visibility: "hidden"
                        }) : this.picker.find(".prev").css({
                            visibility: "visible"
                        });
                        this.o.endDate !== Infinity && n >= this.o.endDate.getUTCFullYear() && i >= this.o.endDate.getUTCMonth() ? this.picker.find(".next").css({
                            visibility: "hidden"
                        }) : this.picker.find(".next").css({
                            visibility: "visible"
                        });
                        break;
                    case 1:
                    case 2:
                        this.o.startDate !== -Infinity && n <= this.o.startDate.getUTCFullYear() ? this.picker.find(".prev").css({
                            visibility: "hidden"
                        }) : this.picker.find(".prev").css({
                            visibility: "visible"
                        });
                        this.o.endDate !== Infinity && n >= this.o.endDate.getUTCFullYear() ? this.picker.find(".next").css({
                            visibility: "hidden"
                        }) : this.picker.find(".next").css({
                            visibility: "visible"
                        })
                }
            }
        },
        click: function(t) {
            var r, e, f, o, h, s, c;
            if (t.preventDefault(), r = n(t.target).closest("span, td, th"), r.length === 1) switch (r[0].nodeName.toLowerCase()) {
                case "th":
                    switch (r[0].className) {
                        case "datepicker-switch":
                            this.showMode(1);
                            break;
                        case "prev":
                        case "next":
                            h = i.modes[this.viewMode].navStep * (r[0].className === "prev" ? -1 : 1);
                            switch (this.viewMode) {
                                case 0:
                                    this.viewDate = this.moveMonth(this.viewDate, h);
                                    this._trigger("changeMonth", this.viewDate);
                                    break;
                                case 1:
                                case 2:
                                    this.viewDate = this.moveYear(this.viewDate, h);
                                    this.viewMode === 1 && this._trigger("changeYear", this.viewDate)
                            }
                            this.fill();
                            break;
                        case "today":
                            s = new Date;
                            s = u(s.getFullYear(), s.getMonth(), s.getDate(), 0, 0, 0);
                            this.showMode(-2);
                            c = this.o.todayBtn === "linked" ? null : "view";
                            this._setDate(s, c);
                            break;
                        case "clear":
                            this.clearDates()
                    }
                    break;
                case "span":
                    r.hasClass("disabled") || (this.viewDate.setUTCDate(1), r.hasClass("month") ? (o = 1, f = r.parent().find("span").index(r), e = this.viewDate.getUTCFullYear(), this.viewDate.setUTCMonth(f), this._trigger("changeMonth", this.viewDate), this.o.minViewMode === 1 && this._setDate(u(e, f, o))) : (o = 1, f = 0, e = parseInt(r.text(), 10) || 0, this.viewDate.setUTCFullYear(e), this._trigger("changeYear", this.viewDate), this.o.minViewMode === 2 && this._setDate(u(e, f, o))), this.showMode(-1), this.fill());
                    break;
                case "td":
                    r.hasClass("day") && !r.hasClass("disabled") && (o = parseInt(r.text(), 10) || 1, e = this.viewDate.getUTCFullYear(), f = this.viewDate.getUTCMonth(), r.hasClass("old") ? f === 0 ? (f = 11, e -= 1) : f -= 1 : r.hasClass("new") && (f === 11 ? (f = 0, e += 1) : f += 1), this._setDate(u(e, f, o)))
            }
            this.picker.is(":visible") && this._focused_from && n(this._focused_from).focus();
            delete this._focused_from
        },
        _toggle_multidate: function(n) {
            var t = this.dates.contains(n);
            if (n || this.dates.clear(), t !== -1 ? (this.o.multidate === !0 || this.o.multidate > 1 || this.o.toggleActive) && this.dates.remove(t) : this.o.multidate === !1 ? (this.dates.clear(), this.dates.push(n)) : this.dates.push(n), typeof this.o.multidate == "number")
                while (this.dates.length > this.o.multidate) this.dates.remove(0)
        },
        _setDate: function(n, t) {
            t && t !== "date" || this._toggle_multidate(n && new Date(n));
            t && t !== "view" || (this.viewDate = n && new Date(n));
            this.fill();
            this.setValue();
            t && t === "view" || this._trigger("changeDate");
            var i;
            this.isInput ? i = this.element : this.component && (i = this.element.find("input"));
            i && i.change();
            this.o.autoclose && (!t || t === "date") && this.hide()
        },
        moveMonth: function(n, i) {
            var e;
            if (!n) return t;
            if (!i) return n;
            var r = new Date(n.valueOf()),
                o = r.getUTCDate(),
                s = r.getUTCMonth(),
                h = Math.abs(i),
                u, f;
            if (i = i > 0 ? 1 : -1, h === 1) f = i === -1 ? function() {
                return r.getUTCMonth() === s
            } : function() {
                return r.getUTCMonth() !== u
            }, u = s + i, r.setUTCMonth(u), (u < 0 || u > 11) && (u = (u + 12) % 12);
            else {
                for (e = 0; e < h; e++) r = this.moveMonth(r, i);
                u = r.getUTCMonth();
                r.setUTCDate(o);
                f = function() {
                    return u !== r.getUTCMonth()
                }
            }
            while (f()) r.setUTCDate(--o), r.setUTCMonth(u);
            return r
        },
        moveYear: function(n, t) {
            return this.moveMonth(n, t * 12)
        },
        dateWithinRange: function(n) {
            return n >= this.o.startDate && n <= this.o.endDate
        },
        keydown: function(n) {
            var o, t, u, i, r, f;
            if (!this.picker.is(":visible")) {
                n.keyCode === 27 && this.show();
                return
            }
            o = !1;
            r = this.focusDate || this.viewDate;
            switch (n.keyCode) {
                case 27:
                    this.focusDate ? (this.focusDate = null, this.viewDate = this.dates.get(-1) || this.viewDate, this.fill()) : this.hide();
                    n.preventDefault();
                    break;
                case 37:
                case 39:
                    if (!this.o.keyboardNavigation) break;
                    t = n.keyCode === 37 ? -1 : 1;
                    n.ctrlKey ? (u = this.moveYear(this.dates.get(-1) || e(), t), i = this.moveYear(r, t), this._trigger("changeYear", this.viewDate)) : n.shiftKey ? (u = this.moveMonth(this.dates.get(-1) || e(), t), i = this.moveMonth(r, t), this._trigger("changeMonth", this.viewDate)) : (u = new Date(this.dates.get(-1) || e()), u.setUTCDate(u.getUTCDate() + t), i = new Date(r), i.setUTCDate(r.getUTCDate() + t));
                    this.dateWithinRange(i) && (this.focusDate = this.viewDate = i, this.setValue(), this.fill(), n.preventDefault());
                    break;
                case 38:
                case 40:
                    if (!this.o.keyboardNavigation) break;
                    t = n.keyCode === 38 ? -1 : 1;
                    n.ctrlKey ? (u = this.moveYear(this.dates.get(-1) || e(), t), i = this.moveYear(r, t), this._trigger("changeYear", this.viewDate)) : n.shiftKey ? (u = this.moveMonth(this.dates.get(-1) || e(), t), i = this.moveMonth(r, t), this._trigger("changeMonth", this.viewDate)) : (u = new Date(this.dates.get(-1) || e()), u.setUTCDate(u.getUTCDate() + t * 7), i = new Date(r), i.setUTCDate(r.getUTCDate() + t * 7));
                    this.dateWithinRange(i) && (this.focusDate = this.viewDate = i, this.setValue(), this.fill(), n.preventDefault());
                    break;
                case 13:
                    r = this.focusDate || this.dates.get(-1) || this.viewDate;
                    this.o.keyboardNavigation && (this._toggle_multidate(r), o = !0);
                    this.focusDate = null;
                    this.viewDate = this.dates.get(-1) || this.viewDate;
                    this.setValue();
                    this.fill();
                    this.picker.is(":visible") && (n.preventDefault(), typeof n.stopPropagation == "function" ? n.stopPropagation() : n.cancelBubble = !0, this.o.autoclose && this.hide());
                    break;
                case 9:
                    this.focusDate = null;
                    this.viewDate = this.dates.get(-1) || this.viewDate;
                    this.fill();
                    this.hide()
            }
            o && (this.dates.length ? this._trigger("changeDate") : this._trigger("clearDate"), this.isInput ? f = this.element : this.component && (f = this.element.find("input")), f && f.change())
        },
        showMode: function(n) {
            n && (this.viewMode = Math.max(this.o.minViewMode, Math.min(2, this.viewMode + n)));
            this.picker.children("div").hide().filter(".datepicker-" + i.modes[this.viewMode].clsName).css("display", "block");
            this.updateNavArrows()
        }
    };
    h = function(t, i) {
        this.element = n(t);
        this.inputs = n.map(i.inputs, function(n) {
            return n.jquery ? n[0] : n
        });
        delete i.inputs;
        o.call(n(this.inputs), i).bind("changeDate", n.proxy(this.dateUpdated, this));
        this.pickers = n.map(this.inputs, function(t) {
            return n(t).data("datepicker")
        });
        this.updateDates()
    };
    h.prototype = {
        updateDates: function() {
            this.dates = n.map(this.pickers, function(n) {
                return n.getUTCDate()
            });
            this.updateRanges()
        },
        updateRanges: function() {
            var t = n.map(this.dates, function(n) {
                return n.valueOf()
            });
            n.each(this.pickers, function(n, i) {
                i.setRange(t)
            })
        },
        dateUpdated: function(t) {
            if (!this.updating) {
                this.updating = !0;
                var e = n(t.target).data("datepicker"),
                    i = e.getUTCDate(),
                    f = n.inArray(t.target, this.inputs),
                    r = f - 1,
                    u = f + 1,
                    o = this.inputs.length;
                if (f !== -1) {
                    if (n.each(this.pickers, function(n, t) {
                            t.getUTCDate() || t.setUTCDate(i)
                        }), i < this.dates[r])
                        while (r >= 0 && i < this.dates[r]) this.pickers[r--].setUTCDate(i);
                    else if (i > this.dates[u])
                        while (u < o && i > this.dates[u]) this.pickers[u++].setUTCDate(i);
                    this.updateDates();
                    delete this.updating
                }
            }
        },
        remove: function() {
            n.map(this.pickers, function(n) {
                n.remove()
            });
            delete this.element.data().datepicker
        }
    };
    a = n.fn.datepicker;
    o = function(i) {
        var u = Array.apply(null, arguments),
            r;
        return u.shift(), this.each(function() {
            var o = n(this),
                e = o.data("datepicker"),
                l = typeof i == "object" && i,
                v;
            if (!e) {
                var a = p(this, "date"),
                    y = n.extend({}, s, a, l),
                    b = w(y.language),
                    c = n.extend({}, s, b, a, l);
                o.hasClass("input-daterange") || c.inputs ? (v = {
                    inputs: c.inputs || o.find("input").toArray()
                }, o.data("datepicker", e = new h(this, n.extend(c, v)))) : o.data("datepicker", e = new f(this, c))
            }
            if (typeof i == "string" && typeof e[i] == "function" && (r = e[i].apply(e, u), r !== t)) return !1
        }), r !== t ? r : this
    };
    n.fn.datepicker = o;
    s = n.fn.datepicker.defaults = {
        autoclose: !1,
        beforeShowDay: n.noop,
        beforeShowMonth: n.noop,
        calendarWeeks: !1,
        clearBtn: !1,
        toggleActive: !1,
        daysOfWeekDisabled: [],
        datesDisabled: [],
        endDate: Infinity,
        forceParse: !0,
        format: "mm/dd/yyyy",
        keyboardNavigation: !0,
        language: "en",
        minViewMode: 0,
        multidate: !1,
        multidateSeparator: ",",
        orientation: "auto",
        rtl: !1,
        startDate: -Infinity,
        startView: 0,
        todayBtn: !1,
        todayHighlight: !1,
        weekStart: 0,
        disableTouchKeyboard: !1,
        enableOnReadonly: !0,
        container: "body"
    };
    v = n.fn.datepicker.locale_opts = ["format", "rtl", "weekStart"];
    n.fn.datepicker.Constructor = f;
    r = n.fn.datepicker.dates = {
        en: {
            days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            today: "Today",
            clear: "Clear"
        }
    };
    i = {
        modes: [{
            clsName: "days",
            navFnc: "Month",
            navStep: 1
        }, {
            clsName: "months",
            navFnc: "FullYear",
            navStep: 1
        }, {
            clsName: "years",
            navFnc: "FullYear",
            navStep: 10
        }],
        isLeapYear: function(n) {
            return n % 4 == 0 && n % 100 != 0 || n % 400 == 0
        },
        getDaysInMonth: function(n, t) {
            return [31, i.isLeapYear(n) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][t]
        },
        validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
        nonpunctuation: /[^ -\/:-@\[\u3400-\u9fff-`{-~\t\n\r]+/g,
        parseFormat: function(n) {
            var t = n.replace(this.validParts, '\0').split('\0'),
                i = n.match(this.validParts);
            if (!t || !t.length || !i || i.length === 0) throw new Error("Invalid date format.");
            return {
                separators: t,
                parts: i
            }
        },
        parseDate: function(e, o, s) {
            function tt() {
                var n = this.slice(0, c[h].length),
                    t = c[h].slice(0, n.length);
                return n.toLowerCase() === t.toLowerCase()
            }
            var nt, c, v, y, h, a, it, d, w;
            if (!e) return t;
            if (e instanceof Date) return e;
            if (typeof o == "string" && (o = i.parseFormat(o)), nt = /([\-+]\d+)([dmwy])/, c = e.match(/([\-+]\d+)([dmwy])/g), /^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(e)) {
                for (e = new Date, h = 0; h < c.length; h++) {
                    v = nt.exec(c[h]);
                    y = parseInt(v[1]);
                    switch (v[2]) {
                        case "d":
                            e.setUTCDate(e.getUTCDate() + y);
                            break;
                        case "m":
                            e = f.prototype.moveMonth.call(f.prototype, e, y);
                            break;
                        case "w":
                            e.setUTCDate(e.getUTCDate() + y * 7);
                            break;
                        case "y":
                            e = f.prototype.moveYear.call(f.prototype, e, y)
                    }
                }
                return u(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate(), 0, 0, 0)
            }
            c = e && e.match(this.nonpunctuation) || [];
            e = new Date;
            var b = {},
                g = ["yyyy", "yy", "M", "MM", "m", "mm", "d", "dd"],
                l = {
                    yyyy: function(n, t) {
                        return n.setUTCFullYear(t)
                    },
                    yy: function(n, t) {
                        return n.setUTCFullYear(2e3 + t)
                    },
                    m: function(n, t) {
                        if (isNaN(n)) return n;
                        for (t -= 1; t < 0;) t += 12;
                        for (t %= 12, n.setUTCMonth(t); n.getUTCMonth() !== t;) n.setUTCDate(n.getUTCDate() - 1);
                        return n
                    },
                    d: function(n, t) {
                        return n.setUTCDate(t)
                    }
                },
                p, k;
            if (l.M = l.MM = l.mm = l.m, l.dd = l.d, e = u(e.getFullYear(), e.getMonth(), e.getDate(), 0, 0, 0), a = o.parts.slice(), c.length !== a.length && (a = n(a).filter(function(t, i) {
                    return n.inArray(i, g) !== -1
                }).toArray()), c.length === a.length) {
                for (h = 0, it = a.length; h < it; h++) {
                    if (p = parseInt(c[h], 10), v = a[h], isNaN(p)) switch (v) {
                        case "MM":
                            k = n(r[s].months).filter(tt);
                            p = n.inArray(k[0], r[s].months) + 1;
                            break;
                        case "M":
                            k = n(r[s].monthsShort).filter(tt);
                            p = n.inArray(k[0], r[s].monthsShort) + 1
                    }
                    b[v] = p
                }
                for (h = 0; h < g.length; h++) w = g[h], w in b && !isNaN(b[w]) && (d = new Date(e), l[w](d, b[w]), isNaN(d) || (e = d))
            }
            return e
        },
        formatDate: function(t, u, f) {
            var e, s, o, h;
            if (!t) return "";
            for (typeof u == "string" && (u = i.parseFormat(u)), e = {
                    d: t.getUTCDate(),
                    D: r[f].daysShort[t.getUTCDay()],
                    DD: r[f].days[t.getUTCDay()],
                    m: t.getUTCMonth() + 1,
                    M: r[f].monthsShort[t.getUTCMonth()],
                    MM: r[f].months[t.getUTCMonth()],
                    yy: t.getUTCFullYear().toString().substring(2),
                    yyyy: t.getUTCFullYear()
                }, e.dd = (e.d < 10 ? "0" : "") + e.d, e.mm = (e.m < 10 ? "0" : "") + e.m, t = [], s = n.extend([], u.separators), o = 0, h = u.parts.length; o <= h; o++) s.length && t.push(s.shift()), t.push(e[u.parts[o]]);
            return t.join("")
        },
        headTemplate: '<thead><tr><th class="prev">&#171;<\/th><th colspan="5" class="datepicker-switch"><\/th><th class="next">&#187;<\/th><\/tr><\/thead>',
        contTemplate: '<tbody><tr><td colspan="7"><\/td><\/tr><\/tbody>',
        footTemplate: '<tfoot><tr><th colspan="7" class="today"><\/th><\/tr><tr><th colspan="7" class="clear"><\/th><\/tr><\/tfoot>'
    };
    i.template = '<div class="datepicker"><div class="datepicker-days"><table class=" table-condensed">' + i.headTemplate + "<tbody><\/tbody>" + i.footTemplate + '<\/table><\/div><div class="datepicker-months"><table class="table-condensed">' + i.headTemplate + i.contTemplate + i.footTemplate + '<\/table><\/div><div class="datepicker-years"><table class="table-condensed">' + i.headTemplate + i.contTemplate + i.footTemplate + "<\/table><\/div><\/div>";
    n.fn.datepicker.DPGlobal = i;
    n.fn.datepicker.noConflict = function() {
        return n.fn.datepicker = a, this
    };
    n.fn.datepicker.version = "1.4.0";
    n(document).on("focus.datepicker.data-api click.datepicker.data-api", '[data-provide="datepicker"]', function(t) {
        var i = n(this);
        i.data("datepicker") || (t.preventDefault(), o.call(i, "show"))
    });
    n(function() {
        o.call(n('[data-provide="datepicker-inline"]'))
    })
})(window.jQuery),
function() {
    function si() {
        n.keyboardSupport && c("keydown", at)
    }

    function d() {
        var i, o, a, l;
        if (!k && document.body) {
            k = !0;
            var t = document.body,
                e = document.documentElement,
                f = window.innerHeight,
                v = t.scrollHeight;
            r = document.compatMode.indexOf("CSS") >= 0 ? e : t;
            u = t;
            si();
            top != self ? s = !0 : di && v > f && (t.offsetHeight <= f || e.offsetHeight <= f) && (i = document.createElement("div"), i.style.cssText = "position:absolute; z-index:-10000; top:0; left:0; right:0; height:" + r.scrollHeight + "px", document.body.appendChild(i), h = function() {
                o || (o = setTimeout(function() {
                    st || (i.style.height = "0", i.style.height = r.scrollHeight + "px", o = null)
                }, 500))
            }, setTimeout(h, 10), c("resize", h), a = {
                attributes: !0,
                childList: !0,
                characterData: !1
            }, p = new pi(h), p.observe(t, a), r.offsetHeight <= f && (l = document.createElement("div"), l.style.clear = "both", t.appendChild(l)));
            n.fixedBackground || st || (t.style.backgroundAttachment = "scroll", e.style.backgroundAttachment = "scroll")
        }
    }

    function hi() {
        p && p.disconnect();
        l(b, lt);
        l("mousedown", vt);
        l("keydown", at);
        l("resize", h);
        l("load", d)
    }

    function ct(t, i, r) {
        var s, f, u, h, c, e;
        (ai(i, r), n.accelerationMax != 1 && (s = Date.now(), f = s - nt, f < n.accelerationDelta && (u = (1 + 50 / f) / 2, u > 1 && (u = Math.min(u, n.accelerationMax), i *= u, r *= u)), nt = Date.now()), o.push({
            x: i,
            y: r,
            lastX: i < 0 ? .99 : -.99,
            lastY: r < 0 ? .99 : -.99,
            start: Date.now()
        }), g) || (h = ni(), c = t === h || t === document.body, t.$scrollBehavior == null && li(t) && (t.$scrollBehavior = t.style.scrollBehavior, t.style.scrollBehavior = "auto"), e = function() {
            for (var a, v, w = Date.now(), s = 0, h = 0, f = 0; f < o.length; f++) {
                var u = o[f],
                    y = w - u.start,
                    p = y >= n.animationTime,
                    l = p ? 1 : y / n.animationTime;
                n.pulseAlgorithm && (l = wi(l));
                a = u.x * l - u.lastX >> 0;
                v = u.y * l - u.lastY >> 0;
                s += a;
                h += v;
                u.lastX += a;
                u.lastY += v;
                p && (o.splice(f, 1), f--)
            }
            c ? window.scrollBy(s, h) : (s && (t.scrollLeft += s), h && (t.scrollTop += h));
            i || r || (o = []);
            o.length ? gt(e, t, 1e3 / n.frameRate + 1) : (g = !1, t.$scrollBehavior != null && (t.style.scrollBehavior = t.$scrollBehavior, t.$scrollBehavior = null))
        }, gt(e, t, 0), g = !0)
    }

    function lt(t) {
        var e, r, i, o;
        if ((k || d(), e = t.target, t.defaultPrevented || t.ctrlKey) || f(u, "embed") || f(e, "embed") && /\.pdf/i.test(e.src) || f(u, "object") || e.shadowRoot) return !0;
        if (r = -t.wheelDeltaX || t.deltaX || 0, i = -t.wheelDeltaY || t.deltaY || 0, ei && (t.wheelDeltaX && a(t.wheelDeltaX, 120) && (r = -120 * (t.wheelDeltaX / Math.abs(t.wheelDeltaX))), t.wheelDeltaY && a(t.wheelDeltaY, 120) && (i = -120 * (t.wheelDeltaY / Math.abs(t.wheelDeltaY)))), r || i || (i = -t.wheelDelta || 0), t.deltaMode === 1 && (r *= 40, i *= 40), o = wt(e), !o) return s && et ? (Object.defineProperty(t, "target", {
            value: window.frameElement
        }), parent.wheel(t)) : !0;
        if (vi(i)) return !0;
        Math.abs(r) > 1.2 && (r *= n.stepSize / 120);
        Math.abs(i) > 1.2 && (i *= n.stepSize / 120);
        ct(o, r, i);
        t.preventDefault();
        pt()
    }

    function at(i) {
        var r = i.target,
            w = i.ctrlKey || i.altKey || i.metaKey || i.shiftKey && i.keyCode !== t.spacebar,
            v, c, h, p, a;
        if ((document.body.contains(u) || (u = document.activeElement), v = /^(textarea|select|embed|object)$/i, c = /^(button|submit|radio|checkbox|file|color|image)$/i, i.defaultPrevented || v.test(r.nodeName) || f(r, "input") && !c.test(r.type) || f(u, "video") || yi(i) || r.isContentEditable || w) || (f(r, "button") || f(r, "input") && c.test(r.type)) && i.keyCode === t.spacebar || f(r, "input") && r.type == "radio" && oi[i.keyCode]) return !0;
        var y, l = 0,
            o = 0,
            e = wt(u);
        if (!e) return s && et ? parent.keydown(i) : !0;
        h = e.clientHeight;
        e == document.body && (h = window.innerHeight);
        switch (i.keyCode) {
            case t.up:
                o = -n.arrowScroll;
                break;
            case t.down:
                o = n.arrowScroll;
                break;
            case t.spacebar:
                y = i.shiftKey ? 1 : -1;
                o = -y * h * .9;
                break;
            case t.pageup:
                o = -h * .9;
                break;
            case t.pagedown:
                o = h * .9;
                break;
            case t.home:
                e == document.body && document.scrollingElement && (e = document.scrollingElement);
                o = -e.scrollTop;
                break;
            case t.end:
                p = e.scrollHeight - e.scrollTop;
                a = p - h;
                o = a > 0 ? a + 10 : 0;
                break;
            case t.left:
                l = -n.arrowScroll;
                break;
            case t.right:
                l = n.arrowScroll;
                break;
            default:
                return !0
        }
        ct(e, l, o);
        i.preventDefault();
        pt()
    }

    function vt(n) {
        u = n.target
    }

    function pt() {
        clearTimeout(yt);
        yt = setInterval(function() {
            it = rt = w = {}
        }, 1e3)
    }

    function ut(n, t, i) {
        for (var u = i ? it : rt, r = n.length; r--;) u[tt(n[r])] = t;
        return t
    }

    function ci(n, t) {
        return (t ? it : rt)[tt(n)]
    }

    function wt(n) {
        var t = [],
            e = document.body,
            o = r.scrollHeight,
            i, u, f;
        do {
            if (i = ci(n, !1), i) return ut(t, i);
            if (t.push(n), o === n.scrollHeight) {
                if (u = kt(r) && kt(e), f = u || dt(r), s && bt(r) || !s && f) return ut(t, ni())
            } else if (bt(n) && dt(n)) return ut(t, n)
        } while (n = n.parentElement)
    }

    function bt(n) {
        return n.clientHeight + 10 < n.scrollHeight
    }

    function kt(n) {
        var t = getComputedStyle(n, "").getPropertyValue("overflow-y");
        return t !== "hidden"
    }

    function dt(n) {
        var t = getComputedStyle(n, "").getPropertyValue("overflow-y");
        return t === "scroll" || t === "auto"
    }

    function li(n) {
        var t = tt(n),
            i;
        return w[t] == null && (i = getComputedStyle(n, "")["scroll-behavior"], w[t] = "smooth" == i), w[t]
    }

    function c(n, t, i) {
        window.addEventListener(n, t, i || !1)
    }

    function l(n, t, i) {
        window.removeEventListener(n, t, i || !1)
    }

    function f(n, t) {
        return n && (n.nodeName || "").toLowerCase() === t.toLowerCase()
    }

    function ai(n, t) {
        n = n > 0 ? 1 : -1;
        t = t > 0 ? 1 : -1;
        (y.x !== n || y.y !== t) && (y.x = n, y.y = t, o = [], nt = 0)
    }

    function vi(n) {
        if (n) {
            i.length || (i = [n, n, n]);
            n = Math.abs(n);
            i.push(n);
            i.shift();
            clearTimeout(ht);
            ht = setTimeout(function() {
                try {
                    localStorage.SS_deltaBuffer = i.join(",")
                } catch (n) {}
            }, 1e3);
            var t = n > 120 && ft(n);
            return !ft(120) && !ft(100) && !t
        }
    }

    function a(n, t) {
        return Math.floor(n / t) == n / t
    }

    function ft(n) {
        return a(i[0], n) && a(i[1], n) && a(i[2], n)
    }

    function yi(n) {
        var t = n.target,
            i = !1;
        if (document.URL.indexOf("www.youtube.com/watch") != -1)
            do
                if (i = t.classList && t.classList.contains("html5-video-controls"), i) break; while (t = t.parentNode);
        return i
    }

    function ti(t) {
        var i, r, u;
        return t = t * n.pulseScale, t < 1 ? i = t - (1 - Math.exp(-t)) : (r = Math.exp(-1), t -= 1, u = 1 - Math.exp(-t), i = r + u * (1 - r)), i * n.pulseNormalize
    }

    function wi(t) {
        return t >= 1 ? 1 : t <= 0 ? 0 : (n.pulseNormalize == 1 && (n.pulseNormalize /= ti(1)), ti(t))
    }

    function v(t) {
        for (var i in t) ot.hasOwnProperty(i) && (n[i] = t[i])
    }
    var ot = {
            frameRate: 150,
            animationTime: 400,
            stepSize: 100,
            pulseAlgorithm: !0,
            pulseScale: 4,
            pulseNormalize: 1,
            accelerationDelta: 50,
            accelerationMax: 3,
            keyboardSupport: !0,
            arrowScroll: 50,
            fixedBackground: !0,
            excluded: ""
        },
        n = ot,
        st = !1,
        s = !1,
        y = {
            x: 0,
            y: 0
        },
        k = !1,
        r = document.documentElement,
        u, p, h, i = [],
        ht, ei = /^Mac/.test(navigator.platform),
        t = {
            left: 37,
            up: 38,
            right: 39,
            down: 40,
            spacebar: 32,
            pageup: 33,
            pagedown: 34,
            end: 35,
            home: 36
        },
        oi = {
            37: 1,
            38: 1,
            39: 1,
            40: 1
        },
        o = [],
        g = !1,
        nt = Date.now(),
        tt = function() {
            var n = 0;
            return function(t) {
                return t.uniqueID || (t.uniqueID = n++)
            }
        }(),
        it = {},
        rt = {},
        yt, w = {},
        fi, b;
    if (window.localStorage && localStorage.SS_deltaBuffer) try {
        i = localStorage.SS_deltaBuffer.split(",")
    } catch (nr) {}
    var gt = function() {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(n, t, i) {
                window.setTimeout(n, i || 1e3 / 60)
            }
        }(),
        pi = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver,
        ni = function() {
            var n = document.scrollingElement;
            return function() {
                var t, i, r;
                return n || (t = document.createElement("div"), t.style.cssText = "height:10000px;width:1px;", document.body.appendChild(t), i = document.body.scrollTop, r = document.documentElement.scrollTop, window.scrollBy(0, 3), n = document.body.scrollTop != i ? document.body : document.documentElement, window.scrollBy(0, -3), document.body.removeChild(t)), n
            }
        }();
    var e = window.navigator.userAgent,
        ii = /Edge/.test(e),
        et = /chrome/i.test(e) && !ii,
        ri = /safari/i.test(e) && !ii,
        bi = /mobile/i.test(e),
        ki = /Windows NT 6.1/i.test(e) && /rv:11/i.test(e),
        di = ri && (/Version\/8/i.test(e) || /Version\/9/i.test(e)),
        gi = (et || ri || ki) && !bi,
        ui = !1;
    try {
        window.addEventListener("test", null, Object.defineProperty({}, "passive", {
            get: function() {
                ui = !0
            }
        }))
    } catch (nr) {}
    fi = ui ? {
        passive: !1
    } : !1;
    b = "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";
    b && gi && (c(b, lt, fi), c("mousedown", vt), c("load", d));
    v.destroy = hi;
    window.SmoothScrollOptions && v(window.SmoothScrollOptions);
    typeof define == "function" && define.amd ? define(function() {
        return v
    }) : "object" == typeof exports ? module.exports = v : window.SmoothScroll = v
}();
/*! Sortable 1.9.0 - MIT | git://github.com/SortableJS/Sortable.git */
! function(n) {
    "use strict";
    "function" == typeof define && define.amd ? define(n) : "undefined" != typeof module && void 0 !== module.exports ? module.exports = n() : window.Sortable = n()
}(function() {
    "use strict";

    function st(n, r) {
        var u, e, f;
        if (!n || !n.getBoundingClientRect) return et();
        u = n;
        e = !1;
        do
            if ((u.clientWidth < u.scrollWidth || u.clientHeight < u.scrollHeight) && (f = i(u), u.clientWidth < u.scrollWidth && ("auto" == f.overflowX || "scroll" == f.overflowX) || u.clientHeight < u.scrollHeight && ("auto" == f.overflowY || "scroll" == f.overflowY))) {
                if (!u || !u.getBoundingClientRect || u === t.body) return et();
                if (e || r) return u;
                e = !0
            } while (u = u.parentNode);
        return et()
    }

    function cr(n, t, i) {
        n.scrollLeft += t;
        n.scrollTop += i
    }

    function lr(t) {
        n && n.parentNode && n.parentNode[d] && n.parentNode[d]._computeIsAligned(t)
    }

    function ar() {
        !tr && u && i(u, "display", "none")
    }

    function vr() {
        !tr && u && i(u, "display", "")
    }

    function lt(t) {
        var r, i, u;
        if (n && (r = function(n, t) {
                for (var i = 0; i < ht.length; i++)
                    if (!or(ht[i])) {
                        var u = s(ht[i]),
                            r = ht[i][d].options.emptyInsertThreshold,
                            f = n >= u.left - r && n <= u.right + r,
                            e = t >= u.top - r && t <= u.bottom + r;
                        if (r && f && e) return ht[i]
                    }
            }((t = t.touches ? t.touches[0] : t).clientX, t.clientY), r)) {
            i = {};
            for (u in t) i[u] = t[u];
            i.target = i.rootEl = r;
            i.preventDefault = void 0;
            i.stopPropagation = void 0;
            r[d]._onDragOver(i)
        }
    }

    function l(n, t) {
        var u, r, i;
        if (!n || !n.nodeType || 1 !== n.nodeType) throw "Sortable: `el` must be HTMLElement, not " + {}.toString.call(n);
        this.el = n;
        this.options = t = uu({}, t);
        n[d] = this;
        u = {
            group: null,
            sort: !0,
            disabled: !1,
            store: null,
            handle: null,
            scroll: !0,
            scrollSensitivity: 30,
            scrollSpeed: 10,
            bubbleScroll: !0,
            draggable: /[uo]l/i.test(n.nodeName) ? ">li" : ">*",
            swapThreshold: 1,
            invertSwap: !1,
            invertedSwapThreshold: null,
            removeCloneOnHide: !0,
            direction: function() {
                return dr(n, this.options)
            },
            ghostClass: "sortable-ghost",
            chosenClass: "sortable-chosen",
            dragClass: "sortable-drag",
            ignore: "a, img",
            filter: null,
            preventOnFilter: !0,
            animation: 0,
            easing: null,
            setData: function(n, t) {
                n.setData("Text", t.textContent)
            },
            dropBubble: !1,
            dragoverBubble: !1,
            dataIdAttr: "data-id",
            delay: 0,
            delayOnTouchOnly: !1,
            touchStartThreshold: tt(window.devicePixelRatio, 10) || 1,
            forceFallback: !1,
            fallbackClass: "sortable-fallback",
            fallbackOnBody: !1,
            fallbackTolerance: 0,
            fallbackOffset: {
                x: 0,
                y: 0
            },
            supportPointer: !1 !== l.supportPointer && "PointerEvent" in window,
            emptyInsertThreshold: 5
        };
        for (r in u) r in t || (t[r] = u[r]);
        for (i in gr(t), this) "_" === i.charAt(0) && "function" == typeof this[i] && (this[i] = this[i].bind(this));
        this.nativeDraggable = !t.forceFallback && su;
        this.nativeDraggable && (this.options.touchStartThreshold = 1);
        t.supportPointer ? e(n, "pointerdown", this._onTapStart) : (e(n, "mousedown", this._onTapStart), e(n, "touchstart", this._onTapStart));
        this.nativeDraggable && (e(n, "dragover", this), e(n, "dragenter", this));
        ht.push(this.el);
        t.store && t.store.get && this.sort(t.store.get(this) || [])
    }

    function g(n, i, r, u) {
        if (n) {
            r = r || t;
            do {
                if (null != i && (">" === i[0] ? n.parentNode === r && sr(n, i) : sr(n, i)) || u && n === r) return n;
                if (n === r) break
            } while (n = (f = n).host && f !== t && f.host.nodeType ? f.host : f.parentNode)
        }
        var f;
        return null
    }

    function e(n, t, i) {
        n.addEventListener(t, i, !ft && wr)
    }

    function f(n, t, i) {
        n.removeEventListener(t, i, !ft && wr)
    }

    function nt(n, t, i) {
        if (n && t)
            if (n.classList) n.classList[i ? "add" : "remove"](t);
            else {
                var r = (" " + n.className + " ").replace(yr, " ").replace(" " + t + " ", " ");
                n.className = (r + (i ? " " + t : "")).replace(yr, " ")
            }
    }

    function i(n, i, r) {
        var u = n && n.style;
        if (u) {
            if (void 0 === r) return t.defaultView && t.defaultView.getComputedStyle ? r = t.defaultView.getComputedStyle(n, "") : n.currentStyle && (r = n.currentStyle), void 0 === i ? r : r[i];
            i in u || -1 !== i.indexOf("webkit") || (i = "-webkit-" + i);
            u[i] = r + ("string" == typeof r ? "" : "px")
        }
    }

    function li(n) {
        var t = "",
            r;
        do r = i(n, "transform"), r && "none" !== r && (t = r + " " + t); while (n = n.parentNode);
        return window.DOMMatrix ? new DOMMatrix(t) : window.WebKitCSSMatrix ? new WebKitCSSMatrix(t) : window.CSSMatrix ? new CSSMatrix(t) : void 0
    }

    function nu(n, t, i) {
        if (n) {
            var u = n.getElementsByTagName(t),
                r = 0,
                f = u.length;
            if (i)
                for (; r < f; r++) i(u[r], r);
            return u
        }
        return []
    }

    function b(n, i, r, u, f, e, s, h, c, l, a) {
        var v, y = (n = n || i[d]).options,
            w = "on" + r.charAt(0).toUpperCase() + r.substr(1);
        !window.CustomEvent || ft || ti ? (v = t.createEvent("Event")).initEvent(r, !0, !0) : v = new CustomEvent(r, {
            bubbles: !0,
            cancelable: !0
        });
        v.to = f || i;
        v.from = e || i;
        v.item = u || i;
        v.clone = o;
        v.oldIndex = s;
        v.newIndex = h;
        v.oldDraggableIndex = c;
        v.newDraggableIndex = l;
        v.originalEvent = a;
        v.pullMode = p ? p.lastPutMode : void 0;
        i && i.dispatchEvent(v);
        y[w] && y[w].call(n, v)
    }

    function tu(n, i, r, u, f, e, o, h) {
        var c, l, a = n[d],
            v = a.options.onMove;
        return !window.CustomEvent || ft || ti ? (c = t.createEvent("Event")).initEvent("move", !0, !0) : c = new CustomEvent("move", {
            bubbles: !0,
            cancelable: !0
        }), c.to = i, c.from = n, c.dragged = r, c.draggedRect = u, c.related = f || i, c.relatedRect = e || s(i), c.willInsertAfter = h, c.originalEvent = o, n.dispatchEvent(c), v && (l = v.call(a, c, o)), l
    }

    function fr(n) {
        n.draggable = !1
    }

    function lu() {
        ir = !1
    }

    function er(t, i, r) {
        for (var o = 0, f = 0, e = t.children; f < e.length;) {
            if ("none" !== e[f].style.display && e[f] !== u && e[f] !== n && g(e[f], r.draggable, t, !1)) {
                if (o === i) return e[f];
                o++
            }
            f++
        }
        return null
    }

    function or(n) {
        for (var t = n.lastElementChild; t && (t === u || "none" === i(t, "display"));) t = t.previousElementSibling;
        return t || null
    }

    function iu(t) {
        return it(n) < it(t) ? 1 : -1
    }

    function au(n) {
        for (var t = n.tagName + n.className + n.src + n.href + n.textContent, i = t.length, r = 0; i--;) r += t.charCodeAt(i);
        return r.toString(36)
    }

    function it(n, t) {
        var i = 0;
        if (!n || !n.parentNode) return -1;
        for (; n && (n = n.previousElementSibling);) "TEMPLATE" === n.nodeName.toUpperCase() || n === o || t && !sr(n, t) || i++;
        return i
    }

    function sr(n, t) {
        if (t) {
            if (">" === t[0] && (t = t.substring(1)), n) try {
                if (n.matches) return n.matches(t);
                if (n.msMatchesSelector) return n.msMatchesSelector(t);
                if (n.webkitMatchesSelector) return n.webkitMatchesSelector(t)
            } catch (n) {
                return !1
            }
            return !1
        }
    }

    function ru(n, t) {
        return function() {
            if (!ii) {
                var i = arguments,
                    r = this;
                ii = wt(function() {
                    1 === i.length ? n.call(r, i[0]) : n.apply(r, i);
                    ii = void 0
                }, t)
            }
        }
    }

    function uu(n, t) {
        if (n && t)
            for (var i in t) t.hasOwnProperty(i) && (n[i] = t[i]);
        return n
    }

    function fu(n) {
        return gi && gi.dom ? gi.dom(n).cloneNode(!0) : pr ? pr(n).clone(!0)[0] : n.cloneNode(!0)
    }

    function ai(n) {
        return wt(n, 0)
    }

    function hr(n) {
        return clearTimeout(n)
    }

    function s(n, t, r, u) {
        var f, e, o, s, h, l, a, v;
        if (n.getBoundingClientRect || n === ut) {
            if (a = n !== ut && n !== et() ? (e = (f = n.getBoundingClientRect()).top, o = f.left, s = f.bottom, h = f.right, l = f.height, f.width) : (o = e = 0, s = window.innerHeight, h = window.innerWidth, l = window.innerHeight, window.innerWidth), u && n !== ut && (r = r || n.parentNode, !ft))
                do
                    if (r && r.getBoundingClientRect && "none" !== i(r, "transform")) {
                        v = r.getBoundingClientRect();
                        e -= v.top + tt(i(r, "border-top-width"));
                        o -= v.left + tt(i(r, "border-left-width"));
                        s = e + f.height;
                        h = o + f.width;
                        break
                    } while (r = r.parentNode);
            if (t && n !== ut) {
                var c = li(r || n),
                    y = c && c.a,
                    p = c && c.d;
                c && (s = (e /= p) + (l /= p), h = (o /= y) + (a /= y))
            }
            return {
                top: e,
                left: o,
                bottom: s,
                right: h,
                width: a,
                height: l
            }
        }
    }

    function eu(n, t) {
        for (var u, i = st(n, !0), r = s(n)[t]; i;) {
            if (u = s(i)[t], !("top" === t || "left" === t ? u <= r : r <= u)) return i;
            if (i === et()) break;
            i = st(i, !1)
        }
        return !1
    }

    function ou(n) {
        var t = 0,
            i = 0,
            u = et();
        if (n)
            do {
                var r = li(n),
                    f = r.a,
                    e = r.d;
                t += n.scrollLeft * f;
                i += n.scrollTop * e
            } while (n !== u && (n = n.parentNode));
        return [t, i]
    }
    var ii;
    if ("undefined" == typeof window || !window.document) return function() {
        throw new Error("Sortable.js requires a window with a document");
    };
    var n, a, u, o, r, ct, vi, at, yi, pi, w, y, k, rt, ri, p, vt, wi, bi, bt, v, ui, yt, kt, dt, fi, c, pt, h = [],
        ki = !1,
        gt = !1,
        ei = !1,
        ht = [],
        ni = !1,
        oi = !1,
        di = [],
        yr = /\s+/g,
        d = "Sortable" + (new Date).getTime(),
        ut = window,
        t = ut.document,
        tt = ut.parseInt,
        wt = ut.setTimeout,
        pr = ut.jQuery || ut.Zepto,
        gi = ut.Polymer,
        wr = {
            capture: !1,
            passive: !1
        },
        ft = !!navigator.userAgent.match(/(?:Trident.*rv[ :]?11\.|msie|iemobile)/i),
        ti = !!navigator.userAgent.match(/Edge/i),
        br = !!navigator.userAgent.match(/firefox/i),
        nr = !(!navigator.userAgent.match(/safari/i) || navigator.userAgent.match(/chrome/i) || navigator.userAgent.match(/android/i)),
        si = !!navigator.userAgent.match(/iP(ad|od|hone)/i),
        kr = ti || ft ? "cssFloat" : "float",
        su = "draggable" in t.createElement("div"),
        tr = function() {
            if (ft) return !1;
            var n = t.createElement("x");
            return n.style.cssText = "pointer-events:auto", "auto" === n.style.pointerEvents
        }(),
        ir = !1,
        rr = !1,
        ot = Math.abs,
        hu = Math.min,
        cu = Math.max,
        hi = [],
        dr = function(n, t) {
            var r = i(n),
                h = tt(r.width) - tt(r.paddingLeft) - tt(r.paddingRight) - tt(r.borderLeftWidth) - tt(r.borderRightWidth),
                f = er(n, 0, t),
                e = er(n, 1, t),
                u = f && i(f),
                o = e && i(e),
                c = u && tt(u.marginLeft) + tt(u.marginRight) + s(f).width,
                a = o && tt(o.marginLeft) + tt(o.marginRight) + s(e).width,
                l;
            return "flex" === r.display ? "column" === r.flexDirection || "column-reverse" === r.flexDirection ? "vertical" : "horizontal" : "grid" === r.display ? r.gridTemplateColumns.split(" ").length <= 1 ? "vertical" : "horizontal" : f && "none" !== u.float ? (l = "left" === u.float ? "left" : "right", !e || "both" !== o.clear && o.clear !== l ? "horizontal" : "vertical") : f && ("block" === u.display || "flex" === u.display || "table" === u.display || "grid" === u.display || h <= c && "none" === r[kr] || e && "none" === r[kr] && h < c + a) ? "vertical" : "horizontal"
        },
        et = function() {
            return ft ? t.documentElement : t.scrollingElement
        },
        ur = ru(function(n, t, r, u) {
            var f, a, y;
            if (t.scroll) {
                var pt = r ? r[d] : window,
                    p = t.scrollSensitivity,
                    ft = t.scrollSpeed,
                    ht = n.clientX,
                    ct = n.clientY,
                    lt = et(),
                    vt = !1;
                yi !== r && (ci(), at = t.scroll, pi = t.scrollFn, !0 === at && (at = st(r, !0), yi = at));
                f = 0;
                a = at;
                do {
                    var w, b, e, k, g, nt, yt, tt, it, o = a,
                        c = s(o),
                        wt = c.top,
                        bt = c.bottom,
                        kt = c.left,
                        dt = c.right,
                        rt = c.width,
                        ut = c.height;
                    if (w = o.scrollWidth, b = o.scrollHeight, e = i(o), tt = o.scrollLeft, it = o.scrollTop, yt = o === lt ? (nt = rt < w && ("auto" === e.overflowX || "scroll" === e.overflowX || "visible" === e.overflowX), ut < b && ("auto" === e.overflowY || "scroll" === e.overflowY || "visible" === e.overflowY)) : (nt = rt < w && ("auto" === e.overflowX || "scroll" === e.overflowX), ut < b && ("auto" === e.overflowY || "scroll" === e.overflowY)), k = nt && (ot(dt - ht) <= p && tt + rt < w) - (ot(kt - ht) <= p && !!tt), g = yt && (ot(bt - ct) <= p && it + ut < b) - (ot(wt - ct) <= p && !!it), !h[f])
                        for (y = 0; y <= f; y++) h[y] || (h[y] = {});
                    h[f].vx == k && h[f].vy == g && h[f].el === o || (h[f].el = o, h[f].vx = k, h[f].vy = g, clearInterval(h[f].pid), !o || 0 == k && 0 == g || (vt = !0, h[f].pid = setInterval(function() {
                        u && 0 === this.layer && (l.active._emulateDragOver(!0), l.active._onTouchMove(v, !0));
                        var t = h[this.layer].vy ? h[this.layer].vy * ft : 0,
                            i = h[this.layer].vx ? h[this.layer].vx * ft : 0;
                        "function" == typeof pi && "continue" !== pi.call(pt, i, t, n, v, h[this.layer].el) || cr(h[this.layer].el, i, t)
                    }.bind({
                        layer: f
                    }), 24)));
                    f++
                } while (t.bubbleScroll && a !== lt && (a = st(a, !1)));
                ki = vt
            }
        }, 30),
        ci = function() {
            h.forEach(function(n) {
                clearInterval(n.pid)
            });
            h = []
        },
        gr = function(n) {
            function r(n, t) {
                return function(i, u, f, e) {
                    var s = i.options.group.name && u.options.group.name && i.options.group.name === u.options.group.name,
                        o;
                    return null == n && (t || s) ? !0 : null == n || !1 === n ? !1 : t && "clone" === n ? n : "function" == typeof n ? r(n(i, u, f, e), t)(i, u, f, e) : (o = (t ? i : u).options.group.name, !0 === n || "string" == typeof n && n === o || n.join && -1 < n.indexOf(o))
                }
            }
            var i = {},
                t = n.group;
            t && "object" == typeof t || (t = {
                name: t
            });
            i.name = t.name;
            i.checkPull = r(t.pull, !0);
            i.checkPut = r(t.put);
            i.revertClone = t.revertClone;
            n.group = i
        };
    return t.addEventListener("click", function(n) {
        if (ei) return n.preventDefault(), n.stopPropagation && n.stopPropagation(), n.stopImmediatePropagation && n.stopImmediatePropagation(), ei = !1
    }, !0), l.prototype = {
        constructor: l,
        _computeIsAligned: function(i) {
            var f, c, l, a, h, o, v, y, p, e, r;
            if (u && !tr ? (ar(), f = t.elementFromPoint(i.clientX, i.clientY), vr()) : f = i.target, f = g(f, this.options.draggable, this.el, !1), !rr && n && n.parentNode === this.el) {
                for (e = this.el.children, r = 0; r < e.length; r++) g(e[r], this.options.draggable, this.el, !1) && e[r] !== f && (e[r].sortableMouseAligned = (c = i.clientX, l = i.clientY, a = e[r], h = this._getDirection(i, null), this.options, void 0, o = s(a), v = "vertical" === h ? o.left : o.top, y = "vertical" === h ? o.right : o.bottom, v < (p = "vertical" === h ? c : l) && p < y));
                g(f, this.options.draggable, this.el, !0) || (yt = null);
                rr = !0;
                wt(function() {
                    rr = !1
                }, 30)
            }
        },
        _getDirection: function(t, i) {
            return "function" == typeof this.options.direction ? this.options.direction.call(this, t, i, n) : this.options.direction
        },
        _onTapStart: function(t) {
            if (t.cancelable) {
                var e, o, h = this,
                    r = this.el,
                    u = this.options,
                    c = u.preventOnFilter,
                    a = t.type,
                    l = t.touches && t.touches[0],
                    i = (l || t).target,
                    s = t.target.shadowRoot && (t.path && t.path[0] || t.composedPath && t.composedPath()[0]) || i,
                    f = u.filter;
                if (function(n) {
                        var t, i, r;
                        for (hi.length = 0, t = n.getElementsByTagName("input"), i = t.length; i--;) r = t[i], r.checked && hi.push(r)
                    }(r), !n && !(/mousedown|pointerdown/.test(a) && 0 !== t.button || u.disabled || s.isContentEditable || (i = g(i, u.draggable, r, !1), vi === i))) {
                    if (e = it(i), o = it(i, u.draggable), "function" == typeof f) {
                        if (f.call(this, t, i, this)) return b(h, s, "filter", i, r, r, e, void 0, o), void(c && t.cancelable && t.preventDefault())
                    } else if (f && (f = f.split(",").some(function(n) {
                            if (n = g(s, n.trim(), r, !1)) return b(h, n, "filter", i, r, r, e, void 0, o), !0
                        }))) return void(c && t.cancelable && t.preventDefault());
                    u.handle && !g(s, u.handle, r, !1) || this._prepareDragStart(t, l, i, e, o)
                }
            }
        },
        _handleAutoScroll: function(i, r) {
            var s;
            if (n && this.options.scroll) {
                var u = i.clientX,
                    f = i.clientY,
                    e = t.elementFromPoint(u, f),
                    o = this;
                if (r || ti || ft || nr) ur(i, o.options, e, r), s = st(e, !0), !ki || vt && u === wi && f === bi || (vt && clearInterval(vt), vt = setInterval(function() {
                    if (n) {
                        var e = st(t.elementFromPoint(u, f), !0);
                        e !== s && (s = e, ci(), ur(i, o.options, s, r))
                    }
                }, 10), wi = u, bi = f);
                else {
                    if (!o.options.bubbleScroll || st(e, !0) === et()) return void ci();
                    ur(i, o.options, st(e, !1), !1)
                }
            }
        },
        _prepareDragStart: function(t, i, u, f, o) {
            var l, s = this,
                v = s.el,
                c = s.options,
                h = v.ownerDocument;
            u && !n && u.parentNode === v && (r = v, a = (n = u).parentNode, ct = n.nextSibling, vi = u, ri = c.group, w = f, k = o, bt = {
                target: n,
                clientX: (i || t).clientX,
                clientY: (i || t).clientY
            }, this._lastX = (i || t).clientX, this._lastY = (i || t).clientY, n.style["will-change"] = "all", n.style.transition = "", n.style.transform = "", l = function() {
                s._disableDelayedDragEvents();
                !br && s.nativeDraggable && (n.draggable = !0);
                s._triggerDragStart(t, i);
                b(s, r, "choose", n, r, r, w, void 0, k);
                nt(n, c.chosenClass, !0)
            }, c.ignore.split(",").forEach(function(t) {
                nu(n, t.trim(), fr)
            }), e(h, "dragover", lt), e(h, "mousemove", lt), e(h, "touchmove", lt), e(h, "mouseup", s._onDrop), e(h, "touchend", s._onDrop), e(h, "touchcancel", s._onDrop), br && this.nativeDraggable && (this.options.touchStartThreshold = 4, n.draggable = !0), !c.delay || c.delayOnTouchOnly && !i || this.nativeDraggable && (ti || ft) ? l() : (e(h, "mouseup", s._disableDelayedDrag), e(h, "touchend", s._disableDelayedDrag), e(h, "touchcancel", s._disableDelayedDrag), e(h, "mousemove", s._delayedDragTouchMoveHandler), e(h, "touchmove", s._delayedDragTouchMoveHandler), c.supportPointer && e(h, "pointermove", s._delayedDragTouchMoveHandler), s._dragStartTimer = wt(l, c.delay)))
        },
        _delayedDragTouchMoveHandler: function(n) {
            var t = n.touches ? n.touches[0] : n;
            cu(ot(t.clientX - this._lastX), ot(t.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1)) && this._disableDelayedDrag()
        },
        _disableDelayedDrag: function() {
            n && fr(n);
            clearTimeout(this._dragStartTimer);
            this._disableDelayedDragEvents()
        },
        _disableDelayedDragEvents: function() {
            var n = this.el.ownerDocument;
            f(n, "mouseup", this._disableDelayedDrag);
            f(n, "touchend", this._disableDelayedDrag);
            f(n, "touchcancel", this._disableDelayedDrag);
            f(n, "mousemove", this._delayedDragTouchMoveHandler);
            f(n, "touchmove", this._delayedDragTouchMoveHandler);
            f(n, "pointermove", this._delayedDragTouchMoveHandler)
        },
        _triggerDragStart: function(i, u) {
            u = u || ("touch" == i.pointerType ? i : null);
            !this.nativeDraggable || u ? this.options.supportPointer ? e(t, "pointermove", this._onTouchMove) : e(t, u ? "touchmove" : "mousemove", this._onTouchMove) : (e(n, "dragend", this), e(r, "dragstart", this._onDragStart));
            try {
                t.selection ? ai(function() {
                    t.selection.empty()
                }) : window.getSelection().removeAllRanges()
            } catch (i) {}
        },
        _dragStarted: function(u, f) {
            if (gt = !1, r && n) {
                this.nativeDraggable && (e(t, "dragover", this._handleAutoScroll), e(t, "dragover", lr));
                var o = this.options;
                u || nt(n, o.dragClass, !1);
                nt(n, o.ghostClass, !0);
                i(n, "transform", "");
                l.active = this;
                u && this._appendGhost();
                b(this, r, "start", n, r, r, w, void 0, k, void 0, f)
            } else this._nulling()
        },
        _emulateDragOver: function(i) {
            if (v) {
                if (this._lastX === v.clientX && this._lastY === v.clientY && !i) return;
                this._lastX = v.clientX;
                this._lastY = v.clientY;
                ar();
                for (var u = t.elementFromPoint(v.clientX, v.clientY), r = u; u && u.shadowRoot && (u = u.shadowRoot.elementFromPoint(v.clientX, v.clientY)) !== r;) r = u;
                if (r)
                    do {
                        if (r[d] && r[d]._onDragOver({
                                clientX: v.clientX,
                                clientY: v.clientY,
                                target: u,
                                rootEl: r
                            }) && !this.options.dragoverBubble) break;
                        u = r
                    } while (r = r.parentNode);
                n.parentNode[d]._computeIsAligned(v);
                vr()
            }
        },
        _onTouchMove: function(n, t) {
            if (bt) {
                var s = this.options,
                    h = s.fallbackTolerance,
                    a = s.fallbackOffset,
                    r = n.touches ? n.touches[0] : n,
                    f = u && li(u),
                    y = u && f && f.a,
                    p = u && f && f.d,
                    e = si && c && ou(c),
                    w = (r.clientX - bt.clientX + a.x) / (y || 1) + (e ? e[0] - di[0] : 0) / (y || 1),
                    b = (r.clientY - bt.clientY + a.y) / (p || 1) + (e ? e[1] - di[1] : 0) / (p || 1),
                    o = n.touches ? "translate3d(" + w + "px," + b + "px,0)" : "translate(" + w + "px," + b + "px)";
                if (!l.active && !gt) {
                    if (h && hu(ot(r.clientX - this._lastX), ot(r.clientY - this._lastY)) < h) return;
                    this._onDragStart(n, !0)
                }
                t || this._handleAutoScroll(r, !0);
                ui = !0;
                v = r;
                i(u, "webkitTransform", o);
                i(u, "mozTransform", o);
                i(u, "msTransform", o);
                i(u, "transform", o);
                n.cancelable && n.preventDefault()
            }
        },
        _appendGhost: function() {
            var h;
            if (!u) {
                var e = this.options.fallbackOnBody ? t.body : r,
                    f = s(n, !0, e, !si),
                    o = (i(n), this.options);
                if (si) {
                    for (c = e;
                        "static" === i(c, "position") && "none" === i(c, "transform") && c !== t;) c = c.parentNode;
                    c !== t && (h = s(c, !0), f.top -= h.top, f.left -= h.left);
                    c !== t.body && c !== t.documentElement ? (c === t && (c = et()), f.top += c.scrollTop, f.left += c.scrollLeft) : c = et();
                    di = ou(c)
                }
                nt(u = n.cloneNode(!0), o.ghostClass, !1);
                nt(u, o.fallbackClass, !0);
                nt(u, o.dragClass, !0);
                i(u, "box-sizing", "border-box");
                i(u, "margin", 0);
                i(u, "top", f.top);
                i(u, "left", f.left);
                i(u, "width", f.width);
                i(u, "height", f.height);
                i(u, "opacity", "0.8");
                i(u, "position", si ? "absolute" : "fixed");
                i(u, "zIndex", "100000");
                i(u, "pointerEvents", "none");
                e.appendChild(u)
            }
        },
        _onDragStart: function(u, s) {
            var h = this,
                c = u.dataTransfer,
                l = h.options;
            (o = fu(n)).draggable = !1;
            o.style["will-change"] = "";
            this._hideClone();
            nt(o, h.options.chosenClass, !1);
            h._cloneId = ai(function() {
                h.options.removeCloneOnHide || r.insertBefore(o, n);
                b(h, r, "clone", n)
            });
            !s && nt(n, l.dragClass, !0);
            s ? (ei = !0, h._loopId = setInterval(h._emulateDragOver, 50)) : (f(t, "mouseup", h._onDrop), f(t, "touchend", h._onDrop), f(t, "touchcancel", h._onDrop), c && (c.effectAllowed = "move", l.setData && l.setData.call(h, c, n)), e(t, "drop", h), i(n, "transform", "translateZ(0)"));
            gt = !0;
            h._dragStartId = ai(h._dragStarted.bind(h, s, u));
            e(t, "selectstart", h);
            nr && i(t.body, "user-select", "none")
        },
        _onDragOver: function(i) {
            function y(r) {
                return r && (et ? o._hideClone() : o._showClone(h), o && (nt(n, p ? p.options.ghostClass : o.options.ghostClass, !1), nt(n, e.ghostClass, !0)), p !== h && h !== l.active ? p = h : h === l.active && (p = null), tt && h._animate(tt, n), u && c && h._animate(c, u)), (u === n && !n.animated || u === f && !u.animated) && (yt = null), e.dragoverBubble || i.rootEl || u === t || (h._handleAutoScroll(i), n.parentNode[d]._computeIsAligned(i), !r && lt(i)), !e.dragoverBubble && i.stopPropagation && i.stopPropagation(), !0
            }

            function si() {
                b(h, r, "change", u, f, r, w, it(n), k, it(n, e.draggable), i)
            }
            var tt, c, vt, f = this.el,
                u = i.target,
                e = this.options,
                bt = e.group,
                o = l.active,
                et = ri === bt,
                hi = e.sort,
                h = this,
                rt, ut;
            if (!ir) {
                if (void 0 !== i.preventDefault && i.cancelable && i.preventDefault(), ui = !0, u = g(u, e.draggable, f, !0), n.contains(i.target) || u.animated) return y(!1);
                if (u !== n && (ei = !1), o && !e.disabled && (et ? hi || (vt = !r.contains(n)) : p === this || (this.lastPutMode = ri.checkPull(this, o, n, i)) && bt.checkPut(this, o, n, i))) {
                    if (rt = this._getDirection(i, u), tt = s(n), vt) return this._hideClone(), a = r, ct ? r.insertBefore(n, ct) : r.appendChild(n), y(!0);
                    if (ut = or(f), ut && (! function(n, t, i) {
                            var r = s(or(i)),
                                f = "vertical" === t ? n.clientY : n.clientX,
                                u = "vertical" === t ? n.clientX : n.clientY,
                                e = "vertical" === t ? r.bottom : r.right,
                                h = "vertical" === t ? r.left : r.top,
                                o = "vertical" === t ? r.right : r.bottom;
                            return "vertical" === t ? o + 10 < u || u <= o && e < f && h <= u : e < f && h < u || f <= e && o + 10 < u
                        }(i, rt, f) || ut.animated)) {
                        if (u && u !== n && u.parentNode === f) {
                            var at, ft = 0,
                                ci = u.sortableMouseAligned,
                                gt = n.parentNode !== f,
                                ti = "vertical" === rt ? "top" : "left",
                                v = eu(u, "top") || eu(n, "top"),
                                li = v ? v.scrollTop : void 0;
                            if (yt !== u && (dt = null, at = s(u)[ti], ni = !1), dt = function(t, i, r) {
                                    var u = t === n && pt || s(t),
                                        f = i === n && pt || s(i),
                                        e = "vertical" === r ? u.left : u.top,
                                        h = "vertical" === r ? u.right : u.bottom,
                                        c = "vertical" === r ? u.width : u.height,
                                        o = "vertical" === r ? f.left : f.top,
                                        l = "vertical" === r ? f.right : f.bottom,
                                        a = "vertical" === r ? f.width : f.height;
                                    return e === o || h === l || e + c / 2 === o + a / 2
                                }(n, u, rt) && ci || gt || v || e.invertSwap || "insert" === dt || "swap" === dt ? ("swap" !== dt && (oi = e.invertSwap || gt), ft = function(t, i, r, u, f, e, o) {
                                    var l = s(i),
                                        h = "vertical" === r ? t.clientY : t.clientX,
                                        c = "vertical" === r ? l.height : l.width,
                                        a = "vertical" === r ? l.top : l.left,
                                        v = "vertical" === r ? l.bottom : l.right,
                                        y = s(n),
                                        p = !1;
                                    if (!e)
                                        if (o && fi < c * u) {
                                            if (!ni && (1 === kt ? a + c * f / 2 < h : h < v - c * f / 2) && (ni = !0), ni) p = !0;
                                            else if ("vertical" === r ? y.top : y.left, "vertical" === r ? y.bottom : y.right, 1 === kt ? h < a + fi : v - fi < h) return -1 * kt
                                        } else if (a + c * (1 - u) / 2 < h && h < v - c * (1 - u) / 2) return iu(i);
                                    return (p = p || e) && (h < a + c * f / 2 || v - c * f / 2 < h) ? a + c / 2 < h ? 1 : -1 : 0
                                }(i, u, rt, e.swapThreshold, null == e.invertedSwapThreshold ? e.swapThreshold : e.invertedSwapThreshold, oi, yt === u), "swap") : (ft = iu(u), "insert"), 0 === ft) return y(!1);
                            pt = null;
                            kt = ft;
                            c = s(yt = u);
                            var ii = u.nextElementSibling,
                                st = !1,
                                ht = tu(r, f, n, tt, u, c, i, st = 1 === ft);
                            if (!1 !== ht) return 1 !== ht && -1 !== ht || (st = 1 === ht), ir = !0, wt(lu, 30), et ? o._hideClone() : o._showClone(this), st && !ii ? f.appendChild(n) : u.parentNode.insertBefore(n, st ? ii : u), v && cr(v, 0, li - v.scrollTop), a = n.parentNode, void 0 === at || oi || (fi = ot(at - s(u)[ti])), si(), y(!0)
                        }
                    } else if (ut && f === i.target && (u = ut), u && (c = s(u)), et ? o._hideClone() : o._showClone(this), !1 !== tu(r, f, n, tt, u, c, i, !!u)) return f.appendChild(n), a = f, pt = null, si(), y(!0);
                    if (f.contains(n)) return y(!1)
                }
                return !1
            }
        },
        _animate: function(t, r) {
            var e = this.options.animation,
                u;
            if (e) {
                if (u = s(r), r === n && (pt = u), 1 === t.nodeType && (t = s(t)), t.left + t.width / 2 !== u.left + u.width / 2 || t.top + t.height / 2 !== u.top + u.height / 2) {
                    var f = li(this.el),
                        o = f && f.a,
                        h = f && f.d;
                    i(r, "transition", "none");
                    i(r, "transform", "translate3d(" + (t.left - u.left) / (o || 1) + "px," + (t.top - u.top) / (h || 1) + "px,0)");
                    this._repaint(r);
                    i(r, "transition", "transform " + e + "ms" + (this.options.easing ? " " + this.options.easing : ""));
                    i(r, "transform", "translate3d(0,0,0)")
                }
                "number" == typeof r.animated && clearTimeout(r.animated);
                r.animated = wt(function() {
                    i(r, "transition", "");
                    i(r, "transform", "");
                    r.animated = !1
                }, e)
            }
        },
        _repaint: function(n) {
            return n.offsetWidth
        },
        _offMoveEvents: function() {
            f(t, "touchmove", this._onTouchMove);
            f(t, "pointermove", this._onTouchMove);
            f(t, "dragover", lt);
            f(t, "mousemove", lt);
            f(t, "touchmove", lt)
        },
        _offUpEvents: function() {
            var n = this.el.ownerDocument;
            f(n, "mouseup", this._onDrop);
            f(n, "touchend", this._onDrop);
            f(n, "pointerup", this._onDrop);
            f(n, "touchcancel", this._onDrop);
            f(t, "selectstart", this)
        },
        _onDrop: function(e) {
            var h = this.el,
                s = this.options;
            ni = oi = ki = gt = !1;
            clearInterval(this._loopId);
            clearInterval(vt);
            ci();
            clearTimeout(ii);
            ii = void 0;
            clearTimeout(this._dragStartTimer);
            hr(this._cloneId);
            hr(this._dragStartId);
            f(t, "mousemove", this._onTouchMove);
            this.nativeDraggable && (f(t, "drop", this), f(h, "dragstart", this._onDragStart), f(t, "dragover", this._handleAutoScroll), f(t, "dragover", lr));
            nr && i(t.body, "user-select", "");
            this._offMoveEvents();
            this._offUpEvents();
            e && (ui && (e.cancelable && e.preventDefault(), !s.dropBubble && e.stopPropagation()), u && u.parentNode && u.parentNode.removeChild(u), (r === a || p && "clone" !== p.lastPutMode) && o && o.parentNode && o.parentNode.removeChild(o), n && (this.nativeDraggable && f(n, "dragend", this), fr(n), n.style["will-change"] = "", nt(n, p ? p.options.ghostClass : this.options.ghostClass, !1), nt(n, this.options.chosenClass, !1), b(this, r, "unchoose", n, a, r, w, null, k, null, e), r !== a ? (y = it(n), rt = it(n, s.draggable), 0 <= y && (b(null, a, "add", n, a, r, w, y, k, rt, e), b(this, r, "remove", n, a, r, w, y, k, rt, e), b(null, a, "sort", n, a, r, w, y, k, rt, e), b(this, r, "sort", n, a, r, w, y, k, rt, e)), p && p.save()) : n.nextSibling !== ct && (y = it(n), rt = it(n, s.draggable), 0 <= y && (b(this, r, "update", n, a, r, w, y, k, rt, e), b(this, r, "sort", n, a, r, w, y, k, rt, e))), l.active && (null != y && -1 !== y || (y = w, rt = k), b(this, r, "end", n, a, r, w, y, k, rt, e), this.save())));
            this._nulling()
        },
        _nulling: function() {
            r = n = a = u = ct = o = vi = at = yi = h.length = vt = wi = bi = bt = v = ui = y = w = yt = kt = pt = p = ri = l.active = null;
            hi.forEach(function(n) {
                n.checked = !0
            });
            hi.length = 0
        },
        handleEvent: function(t) {
            switch (t.type) {
                case "drop":
                case "dragend":
                    this._onDrop(t);
                    break;
                case "dragenter":
                case "dragover":
                    n && (this._onDragOver(t), function(n) {
                        n.dataTransfer && (n.dataTransfer.dropEffect = "move");
                        n.cancelable && n.preventDefault()
                    }(t));
                    break;
                case "selectstart":
                    t.preventDefault()
            }
        },
        toArray: function() {
            for (var n, i = [], r = this.el.children, t = 0, f = r.length, u = this.options; t < f; t++) g(n = r[t], u.draggable, this.el, !1) && i.push(n.getAttribute(u.dataIdAttr) || au(n));
            return i
        },
        sort: function(n) {
            var t = {},
                i = this.el;
            this.toArray().forEach(function(n, r) {
                var u = i.children[r];
                g(u, this.options.draggable, i, !1) && (t[n] = u)
            }, this);
            n.forEach(function(n) {
                t[n] && (i.removeChild(t[n]), i.appendChild(t[n]))
            })
        },
        save: function() {
            var n = this.options.store;
            n && n.set && n.set(this)
        },
        closest: function(n, t) {
            return g(n, t || this.options.draggable, this.el, !1)
        },
        option: function(n, t) {
            var i = this.options;
            if (void 0 === t) return i[n];
            i[n] = t;
            "group" === n && gr(i)
        },
        destroy: function() {
            var n = this.el;
            n[d] = null;
            f(n, "mousedown", this._onTapStart);
            f(n, "touchstart", this._onTapStart);
            f(n, "pointerdown", this._onTapStart);
            this.nativeDraggable && (f(n, "dragover", this), f(n, "dragenter", this));
            Array.prototype.forEach.call(n.querySelectorAll("[draggable]"), function(n) {
                n.removeAttribute("draggable")
            });
            this._onDrop();
            ht.splice(ht.indexOf(this.el), 1);
            this.el = n = null
        },
        _hideClone: function() {
            o.cloneHidden || (i(o, "display", "none"), o.cloneHidden = !0, o.parentNode && this.options.removeCloneOnHide && o.parentNode.removeChild(o))
        },
        _showClone: function(t) {
            "clone" === t.lastPutMode ? o.cloneHidden && (r.contains(n) && !this.options.group.revertClone ? r.insertBefore(o, n) : ct ? r.insertBefore(o, ct) : r.appendChild(o), this.options.group.revertClone && this._animate(n, o), i(o, "display", ""), o.cloneHidden = !1) : this._hideClone()
        }
    }, e(t, "touchmove", function(n) {
        (l.active || gt) && n.cancelable && n.preventDefault()
    }), l.utils = {
        on: e,
        off: f,
        css: i,
        find: nu,
        is: function(n, t) {
            return !!g(n, t, n, !1)
        },
        extend: uu,
        throttle: ru,
        closest: g,
        toggleClass: nt,
        clone: fu,
        index: it,
        nextTick: ai,
        cancelNextTick: hr,
        detectDirection: dr,
        getChild: er
    }, l.create = function(n, t) {
        return new l(n, t)
    }, l.version = "1.9.0", l
});
/*! nouislider - 10.1.0 - 2017-07-28 13:09:54 */
(function(n) {
    typeof define == "function" && define.amd ? define([], n) : typeof exports == "object" ? module.exports = n() : window.noUiSlider = n()
})(function() {
    "use strict";

    function w(n) {
        return typeof n == "object" && typeof n.to == "function" && typeof n.from == "function"
    }

    function b(n) {
        n.parentElement.removeChild(n)
    }

    function c(n) {
        n.preventDefault()
    }

    function k(n) {
        return n.filter(function(n) {
            return this[n] ? !1 : this[n] = !0
        }, {})
    }

    function d(n, t) {
        return Math.round(n / t) * t
    }

    function g(n, t) {
        var r = n.getBoundingClientRect(),
            u = n.ownerDocument,
            f = u.documentElement,
            i = a(u);
        return /webkit.*Chrome.*Mobile/i.test(navigator.userAgent) && (i.x = 0), t ? r.top + i.y - f.clientTop : r.left + i.x - f.clientLeft
    }

    function r(n) {
        return typeof n == "number" && !isNaN(n) && isFinite(n)
    }

    function l(n, i, r) {
        r > 0 && (t(n, i), setTimeout(function() {
            u(n, i)
        }, r))
    }

    function nt(n) {
        return Math.max(Math.min(n, 100), 0)
    }

    function e(n) {
        return Array.isArray(n) ? n : [n]
    }

    function tt(n) {
        n = String(n);
        var t = n.split(".");
        return t.length > 1 ? t[1].length : 0
    }

    function t(n, t) {
        n.classList ? n.classList.add(t) : n.className += " " + t
    }

    function u(n, t) {
        n.classList ? n.classList.remove(t) : n.className = n.className.replace(new RegExp("(^|\\b)" + t.split(" ").join("|") + "(\\b|$)", "gi"), " ")
    }

    function it(n, t) {
        return n.classList ? n.classList.contains(t) : new RegExp("\\b" + t + "\\b").test(n.className)
    }

    function a(n) {
        var t = window.pageXOffset !== undefined,
            i = (n.compatMode || "") === "CSS1Compat",
            r = t ? window.pageXOffset : i ? n.documentElement.scrollLeft : n.body.scrollLeft,
            u = t ? window.pageYOffset : i ? n.documentElement.scrollTop : n.body.scrollTop;
        return {
            x: r,
            y: u
        }
    }

    function rt() {
        return window.navigator.pointerEnabled ? {
            start: "pointerdown",
            move: "pointermove",
            end: "pointerup"
        } : window.navigator.msPointerEnabled ? {
            start: "MSPointerDown",
            move: "MSPointerMove",
            end: "MSPointerUp"
        } : {
            start: "mousedown touchstart",
            move: "mousemove touchmove",
            end: "mouseup touchend"
        }
    }

    function ut() {
        var n = !1,
            t;
        try {
            t = Object.defineProperty({}, "passive", {
                get: function() {
                    n = !0
                }
            });
            window.addEventListener("test", null, t)
        } catch (i) {}
        return n
    }

    function ft() {
        return window.CSS && CSS.supports && CSS.supports("touch-action", "none")
    }

    function o(n, t) {
        return 100 / (t - n)
    }

    function s(n, t) {
        return t * 100 / (n[1] - n[0])
    }

    function et(n, t) {
        return s(n, n[0] < 0 ? t + Math.abs(n[0]) : t - n[0])
    }

    function ot(n, t) {
        return t * (n[1] - n[0]) / 100 + n[0]
    }

    function f(n, t) {
        for (var i = 1; n >= t[i];) i += 1;
        return i
    }

    function st(n, t, i) {
        if (i >= n.slice(-1)[0]) return 100;
        var r = f(i, n),
            e, s, u, h;
        return e = n[r - 1], s = n[r], u = t[r - 1], h = t[r], u + et([e, s], i) / o(u, h)
    }

    function ht(n, t, i) {
        if (i >= 100) return n.slice(-1)[0];
        var r = f(i, t),
            e, s, u, h;
        return e = n[r - 1], s = n[r], u = t[r - 1], h = t[r], ot([e, s], (i - u) * o(u, h))
    }

    function ct(n, t, i, r) {
        if (r === 100) return r;
        var u = f(r, n),
            e, o;
        return i ? (e = n[u - 1], o = n[u], r - e > (o - e) / 2) ? o : e : t[u - 1] ? n[u - 1] + d(r - n[u - 1], t[u - 1]) : r
    }

    function lt(t, i, u) {
        var f;
        if (typeof i == "number" && (i = [i]), Object.prototype.toString.call(i) !== "[object Array]") throw new Error("noUiSlider (" + n + "): 'range' contains invalid value.");
        if (f = t === "min" ? 0 : t === "max" ? 100 : parseFloat(t), !r(f) || !r(i[0])) throw new Error("noUiSlider (" + n + "): 'range' value isn't numeric.");
        u.xPct.push(f);
        u.xVal.push(i[0]);
        f ? u.xSteps.push(isNaN(i[1]) ? !1 : i[1]) : isNaN(i[1]) || (u.xSteps[0] = i[1]);
        u.xHighestCompleteStep.push(0)
    }

    function at(n, t, i) {
        if (!t) return !0;
        i.xSteps[n] = s([i.xVal[n], i.xVal[n + 1]], t) / o(i.xPct[n], i.xPct[n + 1]);
        var r = (i.xVal[n + 1] - i.xVal[n]) / i.xNumSteps[n],
            u = Math.ceil(Number(r.toFixed(3)) - 1),
            f = i.xVal[n] + i.xNumSteps[n] * u;
        i.xHighestCompleteStep[n] = f
    }

    function i(n, t, i) {
        this.xPct = [];
        this.xVal = [];
        this.xSteps = [i || !1];
        this.xNumSteps = [!1];
        this.xHighestCompleteStep = [];
        this.snap = t;
        var r, u = [];
        for (r in n) n.hasOwnProperty(r) && u.push([n[r], r]);
        for (u.length && typeof u[0][0] == "object" ? u.sort(function(n, t) {
                return n[0][0] - t[0][0]
            }) : u.sort(function(n, t) {
                return n[0] - t[0]
            }), r = 0; r < u.length; r++) lt(u[r][1], u[r][0], this);
        for (this.xNumSteps = this.xSteps.slice(0), r = 0; r < this.xNumSteps.length; r++) at(r, this.xNumSteps[r], this)
    }

    function v(t) {
        if (w(t)) return !0;
        throw new Error("noUiSlider (" + n + "): 'format' requires 'to' and 'from' methods.");
    }

    function vt(t, i) {
        if (!r(i)) throw new Error("noUiSlider (" + n + "): 'step' is not numeric.");
        t.singleStep = i
    }

    function yt(t, r) {
        if (typeof r != "object" || Array.isArray(r)) throw new Error("noUiSlider (" + n + "): 'range' is not an object.");
        if (r.min === undefined || r.max === undefined) throw new Error("noUiSlider (" + n + "): Missing 'min' or 'max' in 'range'.");
        if (r.min === r.max) throw new Error("noUiSlider (" + n + "): 'range' 'min' and 'max' cannot be equal.");
        t.spectrum = new i(r, t.snap, t.singleStep)
    }

    function pt(t, i) {
        if (i = e(i), !Array.isArray(i) || !i.length) throw new Error("noUiSlider (" + n + "): 'start' option is incorrect.");
        t.handles = i.length;
        t.start = i
    }

    function wt(t, i) {
        if (t.snap = i, typeof i != "boolean") throw new Error("noUiSlider (" + n + "): 'snap' option must be a boolean.");
    }

    function bt(t, i) {
        if (t.animate = i, typeof i != "boolean") throw new Error("noUiSlider (" + n + "): 'animate' option must be a boolean.");
    }

    function kt(t, i) {
        if (t.animationDuration = i, typeof i != "number") throw new Error("noUiSlider (" + n + "): 'animationDuration' option must be a number.");
    }

    function dt(t, i) {
        var r = [!1],
            u;
        if (i === "lower" ? i = [!0, !1] : i === "upper" && (i = [!1, !0]), i === !0 || i === !1) {
            for (u = 1; u < t.handles; u++) r.push(i);
            r.push(!1)
        } else if (Array.isArray(i) && i.length && i.length === t.handles + 1) r = i;
        else throw new Error("noUiSlider (" + n + "): 'connect' option doesn't match handle count.");
        t.connect = r
    }

    function gt(t, i) {
        switch (i) {
            case "horizontal":
                t.ort = 0;
                break;
            case "vertical":
                t.ort = 1;
                break;
            default:
                throw new Error("noUiSlider (" + n + "): 'orientation' option is invalid.");
        }
    }

    function y(t, i) {
        if (!r(i)) throw new Error("noUiSlider (" + n + "): 'margin' option must be numeric.");
        if (i !== 0 && (t.margin = t.spectrum.getMargin(i), !t.margin)) throw new Error("noUiSlider (" + n + "): 'margin' option is only supported on linear sliders.");
    }

    function ni(t, i) {
        if (!r(i)) throw new Error("noUiSlider (" + n + "): 'limit' option must be numeric.");
        if (t.limit = t.spectrum.getMargin(i), !t.limit || t.handles < 2) throw new Error("noUiSlider (" + n + "): 'limit' option is only supported on linear sliders with 2 or more handles.");
    }

    function ti(t, i) {
        if (!r(i)) throw new Error("noUiSlider (" + n + "): 'padding' option must be numeric.");
        if (i !== 0) {
            if (t.padding = t.spectrum.getMargin(i), !t.padding) throw new Error("noUiSlider (" + n + "): 'padding' option is only supported on linear sliders.");
            if (t.padding < 0) throw new Error("noUiSlider (" + n + "): 'padding' option must be a positive number.");
            if (t.padding >= 50) throw new Error("noUiSlider (" + n + "): 'padding' option must be less than half the range.");
        }
    }

    function ii(t, i) {
        switch (i) {
            case "ltr":
                t.dir = 0;
                break;
            case "rtl":
                t.dir = 1;
                break;
            default:
                throw new Error("noUiSlider (" + n + "): 'direction' option was not recognized.");
        }
    }

    function ri(t, i) {
        if (typeof i != "string") throw new Error("noUiSlider (" + n + "): 'behaviour' must be a string containing options.");
        var f = i.indexOf("tap") >= 0,
            e = i.indexOf("drag") >= 0,
            r = i.indexOf("fixed") >= 0,
            u = i.indexOf("snap") >= 0,
            o = i.indexOf("hover") >= 0;
        if (r) {
            if (t.handles !== 2) throw new Error("noUiSlider (" + n + "): 'fixed' behaviour must be used with 2 handles");
            y(t, t.start[1] - t.start[0])
        }
        t.events = {
            tap: f || u,
            drag: e,
            fixed: r,
            snap: u,
            hover: o
        }
    }

    function ui(t, i) {
        if (t.multitouch = i, typeof i != "boolean") throw new Error("noUiSlider (" + n + "): 'multitouch' option must be a boolean.");
    }

    function fi(t, i) {
        if (i !== !1)
            if (i === !0) {
                t.tooltips = [];
                for (var r = 0; r < t.handles; r++) t.tooltips.push(!0)
            } else {
                if (t.tooltips = e(i), t.tooltips.length !== t.handles) throw new Error("noUiSlider (" + n + "): must pass a formatter for all handles.");
                t.tooltips.forEach(function(t) {
                    if (typeof t != "boolean" && (typeof t != "object" || typeof t.to != "function")) throw new Error("noUiSlider (" + n + "): 'tooltips' must be passed a formatter or 'false'.");
                })
            }
    }

    function ei(n, t) {
        n.ariaFormat = t;
        v(t)
    }

    function oi(n, t) {
        n.format = t;
        v(t)
    }

    function si(t, i) {
        if (i !== undefined && typeof i != "string" && i !== !1) throw new Error("noUiSlider (" + n + "): 'cssPrefix' must be a string or `false`.");
        t.cssPrefix = i
    }

    function hi(t, i) {
        if (i !== undefined && typeof i != "object") throw new Error("noUiSlider (" + n + "): 'cssClasses' must be an object.");
        if (typeof t.cssPrefix == "string") {
            t.cssClasses = {};
            for (var r in i) i.hasOwnProperty(r) && (t.cssClasses[r] = t.cssPrefix + i[r])
        } else t.cssClasses = i
    }

    function ci(t, i) {
        if (i === !0 || i === !1) t.useRequestAnimationFrame = i;
        else throw new Error("noUiSlider (" + n + "): 'useRequestAnimationFrame' option should be true (default) or false.");
    }

    function p(t) {
        var i = {
                margin: 0,
                limit: 0,
                padding: 0,
                animate: !0,
                animationDuration: 300,
                ariaFormat: h,
                format: h
            },
            r = {
                step: {
                    r: !1,
                    t: vt
                },
                start: {
                    r: !0,
                    t: pt
                },
                connect: {
                    r: !0,
                    t: dt
                },
                direction: {
                    r: !0,
                    t: ii
                },
                snap: {
                    r: !1,
                    t: wt
                },
                animate: {
                    r: !1,
                    t: bt
                },
                animationDuration: {
                    r: !1,
                    t: kt
                },
                range: {
                    r: !0,
                    t: yt
                },
                orientation: {
                    r: !1,
                    t: gt
                },
                margin: {
                    r: !1,
                    t: y
                },
                limit: {
                    r: !1,
                    t: ni
                },
                padding: {
                    r: !1,
                    t: ti
                },
                behaviour: {
                    r: !0,
                    t: ri
                },
                multitouch: {
                    r: !0,
                    t: ui
                },
                ariaFormat: {
                    r: !1,
                    t: ei
                },
                format: {
                    r: !1,
                    t: oi
                },
                tooltips: {
                    r: !1,
                    t: fi
                },
                cssPrefix: {
                    r: !1,
                    t: si
                },
                cssClasses: {
                    r: !1,
                    t: hi
                },
                useRequestAnimationFrame: {
                    r: !1,
                    t: ci
                }
            },
            f = {
                connect: !1,
                direction: "ltr",
                behaviour: "tap",
                multitouch: !1,
                orientation: "horizontal",
                cssPrefix: "noUi-",
                cssClasses: {
                    target: "target",
                    base: "base",
                    origin: "origin",
                    handle: "handle",
                    handleLower: "handle-lower",
                    handleUpper: "handle-upper",
                    horizontal: "horizontal",
                    vertical: "vertical",
                    background: "background",
                    connect: "connect",
                    ltr: "ltr",
                    rtl: "rtl",
                    draggable: "draggable",
                    drag: "state-drag",
                    tap: "state-tap",
                    active: "active",
                    tooltip: "tooltip",
                    pips: "pips",
                    pipsHorizontal: "pips-horizontal",
                    pipsVertical: "pips-vertical",
                    marker: "marker",
                    markerHorizontal: "marker-horizontal",
                    markerVertical: "marker-vertical",
                    markerNormal: "marker-normal",
                    markerLarge: "marker-large",
                    markerSub: "marker-sub",
                    value: "value",
                    valueHorizontal: "value-horizontal",
                    valueVertical: "value-vertical",
                    valueNormal: "value-normal",
                    valueLarge: "value-large",
                    valueSub: "value-sub"
                },
                useRequestAnimationFrame: !0
            },
            u;
        return t.format && !t.ariaFormat && (t.ariaFormat = t.format), Object.keys(r).forEach(function(u) {
            if (t[u] === undefined && f[u] === undefined) {
                if (r[u].r) throw new Error("noUiSlider (" + n + "): '" + u + "' is required.");
                return !0
            }
            r[u].t(i, t[u] === undefined ? f[u] : t[u])
        }), i.pips = t.pips, u = [
            ["left", "top"],
            ["right", "bottom"]
        ], i.style = u[i.dir][i.ort], i.styleOposite = u[i.dir ? 0 : 1][i.ort], i
    }

    function li(i, r, f) {
        function ot(n, i) {
            var r = at.createElement("div");
            return i && t(r, i), n.appendChild(r), r
        }

        function yi(n, i) {
            var f = ot(n, r.cssClasses.origin),
                u = ot(f, r.cssClasses.handle);
            return u.setAttribute("data-handle", i), u.setAttribute("tabindex", "0"), u.setAttribute("role", "slider"), u.setAttribute("aria-orientation", r.ort ? "vertical" : "horizontal"), i === 0 ? t(u, r.cssClasses.handleLower) : i === r.handles - 1 && t(u, r.cssClasses.handleUpper), f
        }

        function ei(n, t) {
            return t ? ot(n, r.cssClasses.connect) : !1
        }

        function pi(n, t) {
            o = [];
            w = [];
            w.push(ei(t, n[0]));
            for (var i = 0; i < r.handles; i++) o.push(yi(t, i)), ht[i] = i, w.push(ei(t, n[i + 1]))
        }

        function wi(n) {
            t(n, r.cssClasses.target);
            r.dir === 0 ? t(n, r.cssClasses.ltr) : t(n, r.cssClasses.rtl);
            r.ort === 0 ? t(n, r.cssClasses.horizontal) : t(n, r.cssClasses.vertical);
            tt = ot(n, r.cssClasses.base)
        }

        function bi(n, t) {
            return r.tooltips[t] ? ot(n.firstChild, r.cssClasses.tooltip) : !1
        }

        function ki() {
            var n = o.map(bi);
            ui("update", function(t, i, u) {
                if (n[i]) {
                    var f = t[i];
                    r.tooltips[i] !== !0 && (f = r.tooltips[i].to(u[i]));
                    n[i].innerHTML = f
                }
            })
        }

        function di() {
            ui("update", function(n, t, i, u, f) {
                ht.forEach(function(n) {
                    var t = o[n],
                        u = wt(v, n, 0, !0, !0, !0),
                        e = wt(v, n, 100, !0, !0, !0),
                        s = f[n],
                        h = r.ariaFormat.to(i[n]);
                    t.children[0].setAttribute("aria-valuemin", u.toFixed(1));
                    t.children[0].setAttribute("aria-valuemax", e.toFixed(1));
                    t.children[0].setAttribute("aria-valuenow", s.toFixed(1));
                    t.children[0].setAttribute("aria-valuetext", h)
                })
            })
        }

        function gi(t, i, r) {
            if (t === "range" || t === "steps") return s.xVal;
            if (t === "count") {
                if (!i) throw new Error("noUiSlider (" + n + "): 'values' required for mode 'count'.");
                var f = 100 / (i - 1),
                    u, e = 0;
                for (i = [];
                    (u = e++ * f) <= 100;) i.push(u);
                t = "positions"
            }
            return t === "positions" ? i.map(function(n) {
                return s.fromStepping(r ? s.getStep(n) : n)
            }) : t === "values" ? r ? i.map(function(n) {
                return s.fromStepping(s.getStep(s.toStepping(n)))
            }) : i : void 0
        }

        function nr(n, t, i) {
            function c(n, t) {
                return (n + t).toFixed(7) / 1
            }
            var r = {},
                f = s.xVal[0],
                e = s.xVal[s.xVal.length - 1],
                o = !1,
                h = !1,
                u = 0;
            return i = k(i.slice().sort(function(n, t) {
                return n - t
            })), i[0] !== f && (i.unshift(f), o = !0), i[i.length - 1] !== e && (i.push(e), h = !0), i.forEach(function(f, e) {
                var a, l, v, w = f,
                    y = i[e + 1],
                    p, b, g, k, nt, d, tt;
                if (t === "steps" && (a = s.xNumSteps[e]), a || (a = y - w), w !== !1 && y !== undefined)
                    for (a = Math.max(a, 1e-7), l = w; l <= y; l = c(l, a)) {
                        for (p = s.toStepping(l), b = p - u, nt = b / n, d = Math.round(nt), tt = b / d, v = 1; v <= d; v += 1) g = u + v * tt, r[g.toFixed(5)] = ["x", 0];
                        k = i.indexOf(l) > -1 ? 1 : t === "steps" ? 2 : 0;
                        !e && o && (k = 0);
                        l === y && h || (r[p.toFixed(5)] = [l, k]);
                        u = p
                    }
            }), r
        }

        function tr(n, i, u) {
            function e(n, t) {
                var i = t === r.cssClasses.value,
                    u = i ? h : c,
                    f = i ? o : s;
                return t + " " + u[r.ort] + " " + f[n]
            }

            function l(n, t) {
                t[1] = t[1] && i ? i(t[0], t[1]) : t[1];
                var o = ot(f, !1);
                o.className = e(t[1], r.cssClasses.marker);
                o.style[r.style] = n + "%";
                t[1] && (o = ot(f, !1), o.className = e(t[1], r.cssClasses.value), o.style[r.style] = n + "%", o.innerText = u.to(t[0]))
            }
            var f = at.createElement("div"),
                o = [r.cssClasses.valueNormal, r.cssClasses.valueLarge, r.cssClasses.valueSub],
                s = [r.cssClasses.markerNormal, r.cssClasses.markerLarge, r.cssClasses.markerSub],
                h = [r.cssClasses.valueHorizontal, r.cssClasses.valueVertical],
                c = [r.cssClasses.markerHorizontal, r.cssClasses.markerVertical];
            return t(f, r.cssClasses.pips), t(f, r.ort === 0 ? r.cssClasses.pipsHorizontal : r.cssClasses.pipsVertical), Object.keys(n).forEach(function(t) {
                l(t, n[t])
            }), f
        }

        function oi() {
            lt && (b(lt), lt = null)
        }

        function gt(n) {
            oi();
            var t = n.mode,
                i = n.density || 1,
                r = n.filter || !1,
                u = n.values || !1,
                f = n.stepped || !1,
                e = gi(t, u, f),
                o = nr(i, t, e),
                s = n.format || {
                    to: Math.round
                };
            return lt = h.firstElementChild.appendChild(tr(o, r, s))
        }

        function si() {
            var n = tt.getBoundingClientRect(),
                t = "offset" + ["Width", "Height"][r.ort];
            return r.ort === 0 ? n.width || tt[t] : n.height || tt[t]
        }

        function st(n, t, i, u) {
            var f = function(f) {
                    if (h.hasAttribute("disabled") || it(h, r.cssClasses.tap) || (f = ir(f, u.pageOffset, u.target || t), !f) || n === et.start && f.buttons !== undefined && f.buttons > 1 || u.hover && f.buttons) return !1;
                    fi || f.preventDefault();
                    f.calcPoint = f.points[r.ort];
                    i(f, u)
                },
                e = [];
            return n.split(" ").forEach(function(n) {
                t.addEventListener(n, f, fi ? {
                    passive: !0
                } : !1);
                e.push([n, f])
            }), e
        }

        function ir(n, t, i) {
            var c = n.type.indexOf("touch") === 0,
                l = n.type.indexOf("mouse") === 0,
                s = n.type.indexOf("pointer") === 0,
                u, f, h, e, o;
            if (n.type.indexOf("MSPointer") === 0 && (s = !0), c && r.multitouch)
                if (h = function(n) {
                        return n.target === i || i.contains(n.target)
                    }, n.type === "touchstart") {
                    if (e = Array.prototype.filter.call(n.touches, h), e.length > 1) return !1;
                    u = e[0].pageX;
                    f = e[0].pageY
                } else {
                    if (o = Array.prototype.find.call(n.changedTouches, h), !o) return !1;
                    u = o.pageX;
                    f = o.pageY
                }
            else if (c) {
                if (n.touches.length > 1) return !1;
                u = n.changedTouches[0].pageX;
                f = n.changedTouches[0].pageY
            }
            return t = t || a(at), (l || s) && (u = n.clientX + t.x, f = n.clientY + t.y), n.pageOffset = t, n.points = [u, f], n.cursor = l || s, n
        }

        function hi(n) {
            var i = n - g(tt, r.ort),
                t = i * 100 / si();
            return r.dir ? 100 - t : t
        }

        function rr(n) {
            var t = 100,
                i = !1;
            return o.forEach(function(r, u) {
                if (!r.hasAttribute("disabled")) {
                    var f = Math.abs(v[u] - n);
                    f < t && (i = u, t = f)
                }
            }), i
        }

        function ci(n, t, i, r) {
            var u = i.slice(),
                e = [!n, n],
                o = [n, !n],
                f;
            r = r.slice();
            n && r.reverse();
            r.length > 1 ? r.forEach(function(n, i) {
                var r = wt(u, n, u[n] + t, e[i], o[i], !1);
                r === !1 ? t = 0 : (t = r - u[n], u[n] = r)
            }) : e = o = [!0];
            f = !1;
            r.forEach(function(n, r) {
                f = bt(n, i[n] + t, e[r], o[r]) || f
            });
            f && r.forEach(function(n) {
                y("update", n);
                y("slide", n)
            })
        }

        function y(n, t, i) {
            Object.keys(d).forEach(function(u) {
                var f = u.split(".")[0];
                n === f && d[u].forEach(function(n) {
                    n.call(vt, ct.map(r.format.to), t, ct.slice(), i || !1, v.slice())
                })
            })
        }

        function ur(n, t) {
            n.type === "mouseout" && n.target.nodeName === "HTML" && n.relatedTarget === null && ni(n, t)
        }

        function fr(n, t) {
            if (navigator.appVersion.indexOf("MSIE 9") === -1 && n.buttons === 0 && t.buttonsProperty !== 0) return ni(n, t);
            var i = (r.dir ? -1 : 1) * (n.calcPoint - t.startCalcPoint),
                u = i * 100 / t.baseSize;
            ci(i > 0, u, t.locations, t.handleNumbers)
        }

        function ni(n, t) {
            t.handle && (u(t.handle, r.cssClasses.active), dt -= 1);
            t.listeners.forEach(function(n) {
                yt.removeEventListener(n[0], n[1])
            });
            dt === 0 && (u(h, r.cssClasses.drag), ri(), n.cursor && (pt.style.cursor = "", pt.removeEventListener("selectstart", c)));
            t.handleNumbers.forEach(function(n) {
                y("change", n);
                y("set", n);
                y("end", n)
            })
        }

        function ti(n, i) {
            var u, e;
            if (i.handleNumbers.length === 1) {
                if (e = o[i.handleNumbers[0]], e.hasAttribute("disabled")) return !1;
                u = e.children[0];
                dt += 1;
                t(u, r.cssClasses.active)
            }
            n.stopPropagation();
            var f = [],
                s = st(et.move, yt, fr, {
                    target: n.target,
                    handle: u,
                    listeners: f,
                    startCalcPoint: n.calcPoint,
                    baseSize: si(),
                    pageOffset: n.pageOffset,
                    handleNumbers: i.handleNumbers,
                    buttonsProperty: n.buttons,
                    locations: v.slice()
                }),
                l = st(et.end, yt, ni, {
                    target: n.target,
                    handle: u,
                    listeners: f,
                    handleNumbers: i.handleNumbers
                }),
                a = st("mouseout", yt, ur, {
                    target: n.target,
                    handle: u,
                    listeners: f,
                    handleNumbers: i.handleNumbers
                });
            f.push.apply(f, s.concat(l, a));
            n.cursor && (pt.style.cursor = getComputedStyle(n.target).cursor, o.length > 1 && t(h, r.cssClasses.drag), pt.addEventListener("selectstart", c, !1));
            i.handleNumbers.forEach(function(n) {
                y("start", n)
            })
        }

        function er(n) {
            n.stopPropagation();
            var i = hi(n.calcPoint),
                t = rr(i);
            if (t === !1) return !1;
            r.events.snap || l(h, r.cssClasses.tap, r.animationDuration);
            bt(t, i, !0, !0);
            ri();
            y("slide", t, !0);
            y("update", t, !0);
            y("change", t, !0);
            y("set", t, !0);
            r.events.snap && ti(n, {
                handleNumbers: [t]
            })
        }

        function or(n) {
            var t = hi(n.calcPoint),
                i = s.getStep(t),
                r = s.fromStepping(i);
            Object.keys(d).forEach(function(n) {
                "hover" === n.split(".")[0] && d[n].forEach(function(n) {
                    n.call(vt, r)
                })
            })
        }

        function sr(n) {
            n.fixed || o.forEach(function(n, t) {
                st(et.start, n.children[0], ti, {
                    handleNumbers: [t]
                })
            });
            n.tap && st(et.start, tt, er, {});
            n.hover && st(et.move, tt, or, {
                hover: !0
            });
            n.drag && w.forEach(function(i, u) {
                if (i !== !1 && u !== 0 && u !== w.length - 1) {
                    var e = o[u - 1],
                        s = o[u],
                        f = [i];
                    t(i, r.cssClasses.draggable);
                    n.fixed && (f.push(e.children[0]), f.push(s.children[0]));
                    f.forEach(function(n) {
                        st(et.start, n, ti, {
                            handles: [e, s],
                            handleNumbers: [u - 1, u]
                        })
                    })
                }
            })
        }

        function wt(n, t, i, u, f, e) {
            return (o.length > 1 && (u && t > 0 && (i = Math.max(i, n[t - 1] + r.margin)), f && t < o.length - 1 && (i = Math.min(i, n[t + 1] - r.margin))), o.length > 1 && r.limit && (u && t > 0 && (i = Math.min(i, n[t - 1] + r.limit)), f && t < o.length - 1 && (i = Math.max(i, n[t + 1] - r.limit))), r.padding && (t === 0 && (i = Math.max(i, r.padding)), t === o.length - 1 && (i = Math.min(i, 100 - r.padding))), i = s.getStep(i), i = nt(i), i === n[t] && !e) ? !1 : i
        }

        function ii(n) {
            return n + "%"
        }

        function hr(n, t) {
            v[n] = t;
            ct[n] = s.fromStepping(t);
            var i = function() {
                o[n].style[r.style] = ii(t);
                li(n);
                li(n + 1)
            };
            window.requestAnimationFrame && r.useRequestAnimationFrame ? window.requestAnimationFrame(i) : i()
        }

        function ri() {
            ht.forEach(function(n) {
                var t = v[n] > 50 ? -1 : 1,
                    i = 3 + (o.length + t * n);
                o[n].childNodes[0].style.zIndex = i
            })
        }

        function bt(n, t, i, r) {
            return (t = wt(v, n, t, i, r, !1), t === !1) ? !1 : (hr(n, t), !0)
        }

        function li(n) {
            if (w[n]) {
                var t = 0,
                    i = 100;
                n !== 0 && (t = v[n - 1]);
                n !== w.length - 1 && (i = v[n]);
                w[n].style[r.style] = ii(t);
                w[n].style[r.styleOposite] = ii(100 - i)
            }
        }

        function cr(n, t) {
            n !== null && n !== !1 && (typeof n == "number" && (n = String(n)), n = r.format.from(n), n === !1 || isNaN(n) || bt(t, s.toStepping(n), !1, !1))
        }

        function kt(n, t) {
            var i = e(n),
                u = v[0] === undefined;
            t = t === undefined ? !0 : !!t;
            i.forEach(cr);
            r.animate && !u && l(h, r.cssClasses.tap, r.animationDuration);
            ht.forEach(function(n) {
                bt(n, v[n], !0, !1)
            });
            ri();
            ht.forEach(function(n) {
                y("update", n);
                i[n] !== null && t && y("set", n)
            })
        }

        function lr(n) {
            kt(r.start, n)
        }

        function ai() {
            var n = ct.map(r.format.to);
            return n.length === 1 ? n[0] : n
        }

        function ar() {
            for (var n in r.cssClasses) r.cssClasses.hasOwnProperty(n) && u(h, r.cssClasses[n]);
            while (h.firstChild) h.removeChild(h.firstChild);
            delete h.noUiSlider
        }

        function vr() {
            return v.map(function(n, t) {
                var r = s.getNearbySteps(n),
                    f = ct[t],
                    i = r.thisStep.step,
                    u = null,
                    e;
                return i !== !1 && f + i > r.stepAfter.startValue && (i = r.stepAfter.startValue - f), u = f > r.thisStep.startValue ? r.thisStep.step : r.stepBefore.step === !1 ? !1 : f - r.stepBefore.highestStep, n === 100 ? i = null : n === 0 && (u = null), e = s.countStepDecimals(), i !== null && i !== !1 && (i = Number(i.toFixed(e))), u !== null && u !== !1 && (u = Number(u.toFixed(e))), [u, i]
            })
        }

        function ui(n, t) {
            d[n] = d[n] || [];
            d[n].push(t);
            n.split(".")[0] === "update" && o.forEach(function(n, t) {
                y("update", t)
            })
        }

        function yr(n) {
            var t = n && n.split(".")[0],
                i = t && n.substring(t.length);
            Object.keys(d).forEach(function(n) {
                var r = n.split(".")[0],
                    u = n.substring(r.length);
                t && t !== r || i && i !== u || delete d[n]
            })
        }

        function pr(n, t) {
            var e = ai(),
                u = ["margin", "limit", "padding", "range", "animate", "snap", "step", "format"],
                i;
            u.forEach(function(t) {
                n[t] !== undefined && (f[t] = n[t])
            });
            i = p(f);
            u.forEach(function(t) {
                n[t] !== undefined && (r[t] = i[t])
            });
            s = i.spectrum;
            r.margin = i.margin;
            r.limit = i.limit;
            r.padding = i.padding;
            r.pips && gt(r.pips);
            v = [];
            kt(n.start || e, t)
        }
        var et = rt(),
            vi = ft(),
            fi = vi && ut(),
            h = i,
            v = [],
            tt, o, ht = [],
            dt = 0,
            w, s = r.spectrum,
            ct = [],
            d = {},
            vt, lt, at = i.ownerDocument,
            yt = at.documentElement,
            pt = at.body;
        if (h.noUiSlider) throw new Error("noUiSlider (" + n + "): Slider was already initialized.");
        return wi(h), pi(r.connect, tt), vt = {
            destroy: ar,
            steps: vr,
            on: ui,
            off: yr,
            get: ai,
            set: kt,
            reset: lr,
            __moveHandles: function(n, t, i) {
                ci(n, t, v, i)
            },
            options: f,
            updateOptions: pr,
            target: h,
            removePips: oi,
            pips: gt
        }, sr(r.events), kt(r.start), r.pips && gt(r.pips), r.tooltips && ki(), di(), vt
    }

    function ai(t, i) {
        if (!t || !t.nodeName) throw new Error("noUiSlider (" + n + "): create requires a single element, got: " + t);
        var u = p(i, t),
            r = li(t, u, i);
        return t.noUiSlider = r, r
    }
    var n = "10.1.0",
        h;
    return i.prototype.getMargin = function(t) {
        var i = this.xNumSteps[0];
        if (i && t / i % 1 != 0) throw new Error("noUiSlider (" + n + "): 'limit', 'margin' and 'padding' must be divisible by step.");
        return this.xPct.length === 2 ? s(this.xVal, t) : !1
    }, i.prototype.toStepping = function(n) {
        return st(this.xVal, this.xPct, n)
    }, i.prototype.fromStepping = function(n) {
        return ht(this.xVal, this.xPct, n)
    }, i.prototype.getStep = function(n) {
        return ct(this.xPct, this.xSteps, this.snap, n)
    }, i.prototype.getNearbySteps = function(n) {
        var t = f(n, this.xPct);
        return {
            stepBefore: {
                startValue: this.xVal[t - 2],
                step: this.xNumSteps[t - 2],
                highestStep: this.xHighestCompleteStep[t - 2]
            },
            thisStep: {
                startValue: this.xVal[t - 1],
                step: this.xNumSteps[t - 1],
                highestStep: this.xHighestCompleteStep[t - 1]
            },
            stepAfter: {
                startValue: this.xVal[+t],
                step: this.xNumSteps[+t],
                highestStep: this.xHighestCompleteStep[+t]
            }
        }
    }, i.prototype.countStepDecimals = function() {
        var n = this.xNumSteps.map(tt);
        return Math.max.apply(null, n)
    }, i.prototype.convert = function(n) {
        return this.getStep(this.toStepping(n))
    }, h = {
        to: function(n) {
            return n !== undefined && n.toFixed(2)
        },
        from: Number
    }, {
        version: n,
        create: ai
    }
});
var st = st || {};
st.formatTime = function(n, t) {
    var i;
    return st.timeFormat === "format24" ? (t = t < 10 ? "0" + t : t, i = n + ":" + t) : i = st.formatAMPM(n, t), i
};
st.formatAMPM = function(n, t) {
    var i = n >= 12 ? "pm" : "am";
    return n = n % 12, n = n ? n : 12, t = t < 10 ? "0" + t : t, strTime = n + ":" + t + " " + i
};
localStorage.st = st;
localStorage && localStorage.timeFormat ? st.timeFormat = localStorage.timeFormat : localStorage.timeFormat = st.timeFormat = "format12";
$(document).ready(function() {
    var n = $(".header"),
        t = location.pathname.length <= 1;
    $(window).scroll(function() {
        n.offset().top !== 0 ? n.addClass("header-shadow") : t || n.removeClass("header-shadow")
    });
    $(".hour-switch .hour-format").click(function() {
        var n = $(this);
        $(".hour-switch .hour-format").removeClass("active");
        n.addClass("active");
        localStorage.timeFormat = st.timeFormat = n.data("format");
        $(".time, .timepicker-wrap").addClass("st-hide");
        $(".time." + st.timeFormat + ", .timepicker-wrap." + st.timeFormat).removeClass("st-hide");
        $(".hour-switch").trigger("change", st.timeFormat)
    });
    $(".hour-switch .hour-format[data-format=" + st.timeFormat + "]").click();
    stInit()
});
let xStart, yStart;
const devices = {
        desktop: "desktop",
        tablet: "tablet",
        mobile: "mobile"
    },
    bgColorTableLight = "#ffffff",
    bgColorTableDark = "#282c34";
let deviceType = devices.desktop,
    distanceDelete = -250,
    tableIndex = -1,
    tableWidth, scrollUpDown = !1,
    currentTransition;
const converterView = document.getElementById("converter-view");
(function() {
    const n = navigator.userAgent;
    /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(n) ? deviceType = devices.tablet : /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(n) && (deviceType = devices.mobile)
})();
let selectedDate = moment();
const globalFunctions = {};
$(window).scroll(function() {
    $(this).scrollTop() > 170 ? ($(".sub-nav").addClass("navbar-fixed-top"), $("header.header").addClass("no-padding")) : ($(".sub-nav").removeClass("navbar-fixed-top"), $("header.header").removeClass("no-padding"))
});
converterReady();
const timeFormatCalendars = "YYYYMMDDTHHmmSS",
    dataCalendar = {
        options: {
            "class": "add_event_close",
            id: "event_add"
        },
        data: {
            title: "",
            start: "",
            duration: 60,
            end: "",
            address: "",
            timezone: "",
            offset: "",
            description: "Description of the event"
        }
    };
let updatedLocations;
const generateTimeEvent = function() {
        const n = document.querySelector(".table-time input.time:first-child");
        if (n) {
            dataCalendar.data.address = document.querySelector(".table-time .time-abb:first-child").textContent;
            dataCalendar.data.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            dataCalendar.data.offset = +n.dataset.offset;
            const t = selectedDate.format("MMM DD, YYYY"),
                i = $("input.time:first").val();
            dataCalendar.data.start = new Date(`${t} ${i}`);
            dataCalendar.data.description = location.href
        }
    },
    generateDescriptions = (n, t) => {
        const [o] = document.querySelectorAll(".table-time"), [s] = o.getElementsByTagName("input"), f = s.value;
        let e = changeTimeSubtractOffset(f, updatedLocations[0].Offset, !1),
            i = "",
            u = "",
            r = "https://savvytime.com/converter/";
        for (let n = 0; n < updatedLocations.length; n++) n > 0 && (i += t), n > 0 && n < 2 && (r += "-to-", u += " - "), n > 1 && (r += "-", u += " - "), i += `${updatedLocations[n].city?updatedLocations[n].city:updatedLocations[n].Abbreviation}`, i += ` ${changeTimeToOffset(e,updatedLocations[n].Offset)}`, i += ` ${changeDateToOffset(e,updatedLocations[n].Offset)}`, r += updatedLocations[n].Id, u += updatedLocations[n].city ? updatedLocations[n].city : updatedLocations[n].Abbreviation, n === updatedLocations.length - 1 && (u += " Time Zone Converter");
        return r += `/${changeDateToOffset(f,0,!0)}`, r += `/${changeTimeToOffset(f,0,!0)}`, n === "google" ? (i += `${t}<a href=${r}>${u}</a>`, i += `${t}Scheduled with <a href="https://savvytime.com/converter">Savvy Time</a>`) : (i += `${t}${r}`, i += `${t}Scheduled with https://savvytime.com/converter`), i
    },
    generateHTML = function() {
        updatedLocations = Array.from(document.querySelectorAll(".table-time")).map(n => n.dataset.id).map(n => locations.find(t => t.Id === n));
        const n = document.getElementById("event_add");
        if (n) {
            const t = document.querySelector("div.add");
            t.classList.remove("add_event_open");
            t.classList.add("add_event_close");
            n.remove()
        }
        document.querySelector(".open").appendChild(createCalendar(dataCalendar));
        const t = document.querySelector("div.add");
        t.classList.remove("add_event_close");
        t.classList.add("add_event_open")
    };
window.addEventListener("click", n => {
    const i = $(n.target).closest(".btn-cal").length,
        t = document.querySelector(".add");
    if (i && !t) generateHTML();
    else if (i && t) t.classList.remove("add_event_open"), t.classList.add("add_event_close"), t.remove();
    else {
        if (!t) return;
        t.classList.remove("add_event_close");
        t.classList.add("add_event_open");
        t.remove()
    }
});
const currentOffset = moment().utcOffset() / 60,
    timeStartGoogle = function(n) {
        const t = moment(n.start).add(-n.offset, "h");
        return t.format(timeFormatCalendars) + "Z"
    },
    timeEndGoogle = function(n) {
        const t = moment(n.start).add(-n.offset + 1, "h");
        return t.format(timeFormatCalendars) + "Z"
    },
    timeStart = function(n) {
        const t = moment(n.start).add(-n.offset + currentOffset, "h");
        return t.format(timeFormatCalendars)
    },
    timeEnd = function(n) {
        const t = moment(n.start).add(-n.offset + currentOffset + 1, "h");
        return t.format(timeFormatCalendars)
    },
    validParams = function(n) {
        return n.data !== undefined && n.data.start !== undefined && (n.data.end !== undefined || n.data.duration !== undefined)
    },
    generateMarkup = function(n, t, i) {
        const r = document.createElement("div");
        return Object.keys(n).forEach(function(t) {
            r.innerHTML += n[t]
        }), r.className = "add", t !== undefined && (r.className += " " + t), r.id = i, r
    },
    getClass = function(n) {
        if (n.options && n.options.class) return n.options.class
    },
    getOrGenerateCalendarId = function(n) {
        return n.options && n.options.id ? n.options.id : Math.floor(Math.random() * 1e6)
    },
    calendarGenerators = {
        google: function(n) {
            const t = timeStartGoogle(n),
                i = timeEndGoogle(n),
                r = encodeURI(["https://www.google.com/calendar/render", "?action=TEMPLATE", "&text=" + (n.title || ""), "&dates=" + (t || ""), "/" + (i || ""), "&ctz=" + (n.timezone || ""), "&details=" + (generateDescriptions("google", "\n \n") || n.description || ""), "&location=" + (n.address || ""), "&sprop=&sprop=name:"].join(""));
            return '<a class="icon google" target="_blank" href="' + r + '">Google Calendar<\/a>'
        },
        yahoo: function(n) {
            const t = timeStart(n),
                i = timeEnd(n),
                r = encodeURI(["http://calendar.yahoo.com/?v=60&view=d&type=20", "&title=" + (n.title || ""), "&st=" + (t || ""), "&et=" + (i || ""), "&desc=" + (generateDescriptions(!1, "\n \n") || n.description || ""), "&in_loc=" + (n.address || "")].join(""));
            return '<a class="icon yahoo" target="_blank" href="' + r + '">Yahoo! Calendar<\/a>'
        },
        ics: function(n, t, i, r, u) {
            const f = timeStart(n),
                e = timeEnd(n),
                o = encodeURI("data:text/calendar;charset=utf8," + ["BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT", "SUMMARY:" + (n.title || ""), "DTSTART;TZID=" + n.timezone + ":" + (f || ""), "DTEND;TZID=" + n.timezone + ":" + (e || ""), "LOCATION:" + (n.address || ""), "DESCRIPTION" + (r ? ";ENCODING=QUOTED-PRINTABLE" : "") + ":" + (generateDescriptions(!1, u) || n.description || ""), "URL:https://savvytime.com/converter/", "END:VEVENT", "END:VCALENDAR"].join("\n"));
            return '<a class="' + t + '" download="calendar" target="_blank" href="' + o + '">' + i + " Calendar<\/a>"
        },
        iCal: function(n) {
            return this.ics(n, "icon ical", "iCal", !1, "\\n \\n")
        },
        outlook: function(n) {
            return this.ics(n, "icon outlook", "Outlook", !0, "=0D=0A =0D=0A")
        }
    },
    generateCalendars = function(n) {
        return {
            google: calendarGenerators.google(n),
            outlook: calendarGenerators.outlook(n),
            iCal: calendarGenerators.iCal(n),
            yahoo: calendarGenerators.yahoo(n)
        }
    },
    createCalendar = function(n) {
        if (!validParams(n)) {
            console.log("Event details missing.");
            return
        }
        return generateTimeEvent(), generateMarkup(generateCalendars(n.data), getClass(n), getOrGenerateCalendarId(n))
    },
    themes = {
        light: "light",
        dark: "dark"
    };
let lightTheme = !0;
const btnTheme = document.querySelector(".btn-theme"),
    logo = document.querySelector(".logo"),
    pathImageClock = {
        dark: "dts_clock_dark",
        light: "dts_clock"
    },
    pathConverter = "path=/converter";
(function() {
    const n = localStorage.themeMode;
    n === themes.dark && (lightTheme = !1, document.body.classList.remove(`${themes.light}`), document.body.classList.add(`${themes.dark}`));
    setBtn();
    updateContent()
})();
btnTheme.addEventListener("click", modeSwitch);