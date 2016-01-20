/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global', './library', 'sap/ui/core/Control'], function (q, l, C) {
    "use strict";
    var S = C.extend("sap.m.Shell", {
        metadata: {
            library: "sap.m",
            properties: {
                title: {type: "string", group: "Misc", defaultValue: null},
                logo: {type: "sap.ui.core.URI", group: "Appearance", defaultValue: null},
                showLogout: {type: "boolean", group: "Behavior", defaultValue: true},
                headerRightText: {type: "string", group: "Data", defaultValue: null},
                appWidthLimited: {type: "boolean", group: "Appearance", defaultValue: true},
                backgroundColor: {type: "sap.ui.core.CSSColor", group: "Appearance", defaultValue: null},
                backgroundImage: {type: "sap.ui.core.URI", group: "Appearance", defaultValue: null},
                backgroundRepeat: {type: "boolean", group: "Appearance", defaultValue: false},
                backgroundOpacity: {type: "float", group: "Appearance", defaultValue: 1},
                homeIcon: {type: "object", group: "Misc", defaultValue: null}
            },
            defaultAggregation: "app",
            aggregations: {app: {type: "sap.ui.core.Control", multiple: false}},
            events: {logout: {}}
        }
    });
    S.prototype.init = function () {
        sap.ui.getCore().attachThemeChanged(q.proxy(function () {
            var $ = this.$("hdr");
            if ($.length) {
                $.find(".sapMShellLogo").remove();
                var h = sap.m.ShellRenderer.getLogoImageHtml(this);
                $.prepend(q(h));
            }
        }, this));
        q.sap.initMobile({statusBar: "default", hideBrowser: true});
    };
    S.prototype.onAfterRendering = function () {
        var r = this.getDomRef().parentNode, $;
        if (r && !r._sapui5_heightFixed) {
            r._sapui5_heightFixed = true;
            while (r && r !== document.documentElement) {
                $ = q(r);
                if ($.attr("data-sap-ui-root-content")) {
                    break;
                }
                if (!r.style.height) {
                    r.style.height = "100%";
                }
                r = r.parentNode;
            }
        }
        this.$("content").css("height", "");
    };
    S.prototype.ontap = function (e) {
        if (e.target.className && e.target.className.indexOf && e.target.className.indexOf("sapMShellHeaderLogout") > -1) {
            this.fireLogout();
        }
    };
    S.prototype.setTitle = function (t) {
        this.$("hdrTxt").text(t);
        this.setProperty("title", t, true);
        return this;
    };
    S.prototype.setHeaderRightText = function (t) {
        this.setProperty("headerRightText", t, true);
        if (!t) {
            t = "";
        }
        this.$("hdrRightTxt").text(t).css("display", (!!t ? "inline" : "none"));
        return this;
    };
    S.prototype.setAppWidthLimited = function (L) {
        this.$().toggleClass("sapMShellAppWidthLimited", L);
        this.setProperty("appWidthLimited", L, true);
        return this;
    };
    S.prototype.setBackgroundOpacity = function (o) {
        if (o > 1 || o < 0) {
            q.sap.log.warning("Invalid value " + o + " for Shell.setBackgroundOpacity() ignored. Valid values are: floats between 0 and 1.");
            return this;
        }
        this.$("BG").css("opacity", o);
        return this.setProperty("backgroundOpacity", o, true);
    };
    S.prototype.setHomeIcon = function (i) {
        this.setProperty("homeIcon", i, true);
        q.sap.setIcons(i);
    };
    return S;
}, true);
