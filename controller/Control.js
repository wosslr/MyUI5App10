/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global', './CustomStyleClassSupport', './Element', './UIArea', './ResizeHandler', './BusyIndicatorUtils'], function (q, C, E, U, R, B) {
    "use strict";
    var a = E.extend("sap.ui.core.Control", {
        metadata: {
            stereotype: "control",
            "abstract": true,
            publicMethods: ["placeAt", "attachBrowserEvent", "detachBrowserEvent", "getControlsByFieldGroup", "triggerValidateFieldGroup", "checkFieldGroupIds"],
            library: "sap.ui.core",
            properties: {
                "busy": {type: "boolean", defaultValue: false},
                "busyIndicatorDelay": {type: "int", defaultValue: 1000},
                "visible": {type: "boolean", group: "Appearance", defaultValue: true},
                "fieldGroupIds": {type: "string[]", defaultValue: []}
            },
            events: {validateFieldGroup: {enableEventBubbling: true, parameters: {fieldGroupIds: {type: "string[]"}}}}
        }, constructor: function (i, s) {
            this.bAllowTextSelection = true;
            E.apply(this, arguments);
            this.bOutput = this.getDomRef() != null;
            if (this._sapUiCoreLocalBusy_initBusyIndicator) {
                this._sapUiCoreLocalBusy_initBusyIndicator();
            }
        }, renderer: null
    });
    a.prototype.clone = function () {
        var c = E.prototype.clone.apply(this, arguments);
        if (this.aBindParameters) {
            for (var i = 0, l = this.aBindParameters.length; i < l; i++) {
                var p = this.aBindParameters[i];
                c.attachBrowserEvent(p.sEventType, p.fnHandler, p.oListener !== this ? p.oListener : undefined);
            }
        }
        c.bAllowTextSelection = this.bAllowTextSelection;
        return c;
    };
    C.apply(a.prototype);
    a.prototype.isActive = function () {
        return q.sap.domById(this.sId) != null;
    };
    a.prototype.invalidate = function (o) {
        var u;
        if (this.bOutput && (u = this.getUIArea())) {
            if (!this._bIsBeingDestroyed) {
                u.addInvalidatedControl(this);
            }
        } else {
            var p = this.getParent();
            if (p && (this.bOutput || !(this.getVisible && this.getVisible() === false))) {
                p.invalidate(this);
            }
        }
    };
    a.prototype.rerender = function () {
        U.rerenderControl(this);
    };
    a.prototype.allowTextSelection = function (A) {
        this.bAllowTextSelection = A;
        return this;
    };
    a.prototype.attachBrowserEvent = function (e, h, l) {
        if (e && (typeof(e) === "string")) {
            if (h && typeof(h) === "function") {
                if (!this.aBindParameters) {
                    this.aBindParameters = [];
                }
                l = l || this;
                var p = function () {
                    h.apply(l, arguments);
                };
                this.aBindParameters.push({sEventType: e, fnHandler: h, oListener: l, fnProxy: p});
                if (!this._sapui_bInAfterRenderingPhase) {
                    this.$().bind(e, p);
                }
            }
        }
        return this;
    };
    a.prototype.detachBrowserEvent = function (e, h, l) {
        if (e && (typeof(e) === "string")) {
            if (h && typeof(h) === "function") {
                var $ = this.$(), i, p;
                l = l || this;
                if (this.aBindParameters) {
                    for (i = this.aBindParameters.length - 1; i >= 0; i--) {
                        p = this.aBindParameters[i];
                        if (p.sEventType === e && p.fnHandler === h && p.oListener === l) {
                            this.aBindParameters.splice(i, 1);
                            $.unbind(e, p.fnProxy);
                        }
                    }
                }
            }
        }
        return this;
    };
    a.prototype.getRenderer = function () {
        return sap.ui.core.RenderManager.getRenderer(this);
    };
    a.prototype.placeAt = function (r, p) {
        var c = sap.ui.getCore();
        if (c.isInitialized()) {
            var o = r;
            if (typeof o === "string") {
                o = c.byId(r);
            }
            var i = false;
            if (!(o instanceof E)) {
                o = c.createUIArea(r);
                i = true;
            }
            if (!o) {
                return this;
            }
            if (!i) {
                var b = o.getMetadata().getAggregation("content");
                var d = true;
                if (b) {
                    if (!b.multiple || b.type != "sap.ui.core.Control") {
                        d = false;
                    }
                } else {
                    if (!o.addContent || !o.insertContent || !o.removeAllContent) {
                        d = false;
                    }
                }
                if (!d) {
                    q.sap.log.warning("placeAt cannot be processed because container " + o + " does not have an aggregation 'content'.");
                    return this;
                }
            }
            if (typeof p === "number") {
                o.insertContent(this, p);
            } else {
                p = p || "last";
                switch (p) {
                    case"last":
                        o.addContent(this);
                        break;
                    case"first":
                        o.insertContent(this, 0);
                        break;
                    case"only":
                        o.removeAllContent();
                        o.addContent(this);
                        break;
                    default:
                        q.sap.log.warning("Position " + p + " is not supported for function placeAt.");
                }
            }
        } else {
            var t = this;
            c.attachInitEvent(function () {
                t.placeAt(r, p);
            });
        }
        return this;
    };
    a.prototype.onselectstart = function (b) {
        if (!this.bAllowTextSelection) {
            b.preventDefault();
            b.stopPropagation();
        }
    };
    a.prototype.getIdForLabel = function () {
        return this.getId();
    };
    a.prototype.destroy = function (s) {
        this._bIsBeingDestroyed = true;
        this._cleanupBusyIndicator();
        R.deregisterAllForControl(this.getId());
        if (!this.getVisible()) {
            var p = document.getElementById(sap.ui.core.RenderManager.createInvisiblePlaceholderId(this));
            if (p && p.parentNode) {
                p.parentNode.removeChild(p);
            }
        }
        E.prototype.destroy.call(this, s);
    };
    (function () {
        var p = "focusin focusout keydown keypress keyup mousedown touchstart mouseup touchend click", b = {
            onAfterRendering: function () {
                if (this.getBusy() && this.$() && !this._busyIndicatorDelayedCallId) {
                    this._busyIndicatorDelayedCallId = q.sap.delayedCall(this.getBusyIndicatorDelay(), this, A);
                }
            }
        }, A = function () {
            var $ = this.$(this._sBusySection), f = ["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "menuitem", "meta", "param", "source", "track", "wbr"];
            if (this._busyIndicatorDelayedCallId) {
                q.sap.clearDelayedCall(this._busyIndicatorDelayedCallId);
                delete this._busyIndicatorDelayedCallId;
            }
            if (!$ || $.length === 0) {
                q.sap.log.warning("BusyIndicator could not be rendered. The outer control instance is not valid anymore.");
                return;
            }
            var t = $.get(0) && $.get(0).tagName;
            if (t && q.inArray(t.toLowerCase(), f) >= 0) {
                q.sap.log.warning("BusyIndicator cannot be placed in elements with tag '" + t + "'.");
                return;
            }
            if ($.css('position') == 'static') {
                this._busyStoredPosition = 'static';
                $.css('position', 'relative');
            }
            this._$BusyIndicator = B.addHTML($, this.getId() + "-busyIndicator");
            B.animateIE9.start(this._$BusyIndicator);
            h.apply(this, [true]);
        }, h = function (c) {
            var $ = this.$(this._sBusySection);
            if (c) {
                var t = $.find(":sapTabbable"), d = this;
                this._busyTabIndices = [];
                this._busyTabIndices.push({ref: $, tabindex: $.attr('tabindex')});
                $.attr('tabindex', -1);
                $.bind(p, P);
                t.each(function (i, o) {
                    var r = q(o), T = r.attr('tabindex');
                    if (T < 0) {
                        return true;
                    }
                    d._busyTabIndices.push({ref: r, tabindex: T});
                    r.attr('tabindex', -1);
                    r.bind(p, P);
                });
            } else {
                if (this._busyTabIndices) {
                    q.each(this._busyTabIndices, function (i, o) {
                        if (o.tabindex) {
                            o.ref.attr('tabindex', o.tabindex);
                        } else {
                            o.ref.removeAttr('tabindex');
                        }
                        o.ref.unbind(p, P);
                    });
                }
                this._busyTabIndices = [];
            }
        }, P = function (e) {
            q.sap.log.debug("Local Busy Indicator Event Suppressed: " + e.type);
            e.preventDefault();
            e.stopImmediatePropagation();
        };
        a.prototype.setBusy = function (c, s) {
            this._sBusySection = s;
            var $ = this.$(this._sBusySection);
            if (c == this.getProperty("busy")) {
                return this;
            }
            this.setProperty("busy", c, true);
            if (c) {
                this.addDelegate(b, false, this);
            } else {
                this.removeDelegate(b);
                if (this._busyIndicatorDelayedCallId) {
                    q.sap.clearDelayedCall(this._busyIndicatorDelayedCallId);
                    delete this._busyIndicatorDelayedCallId;
                }
            }
            if (!this.getDomRef()) {
                return this;
            }
            if (c) {
                if (this.getBusyIndicatorDelay() <= 0) {
                    A.apply(this);
                } else {
                    this._busyIndicatorDelayedCallId = q.sap.delayedCall(this.getBusyIndicatorDelay(), this, A);
                }
            } else {
                this.$("busyIndicator").remove();
                this.$().removeClass('sapUiLocalBusy');
                this.$().removeAttr('aria-busy');
                if (this._busyStoredPosition) {
                    $.css('position', this._busyStoredPosition);
                    delete this._busyStoredPosition;
                }
                h.apply(this, [false]);
                B.animateIE9.stop(this._$BusyIndicator);
            }
            return this;
        };
        a.prototype.isBusy = function () {
            return this.getProperty("busy");
        };
        a.prototype.setBusyIndicatorDelay = function (d) {
            this.setProperty("busyIndicatorDelay", d, true);
            return this;
        };
        a.prototype._cleanupBusyIndicator = function () {
            if (this._busyIndicatorDelayedCallId) {
                q.sap.clearDelayedCall(this._busyIndicatorDelayedCallId);
                delete this._busyIndicatorDelayedCallId;
            }
            B.animateIE9.stop(this._$BusyIndicator);
        };
        a.prototype.getControlsByFieldGroupId = function (f) {
            return this.findAggregatedObjects(true, function (e) {
                if (e instanceof a) {
                    return e.checkFieldGroupIds(f);
                }
                return false;
            });
        };
        a.prototype.checkFieldGroupIds = function (f) {
            if (typeof f === "string") {
                if (f === "") {
                    return this.checkFieldGroupIds([]);
                }
                return this.checkFieldGroupIds(f.split(","));
            }
            var F = this.getFieldGroupIds();
            if (q.isArray(f)) {
                var c = 0;
                for (var i = 0; i < f.length; i++) {
                    if (F.indexOf(f[i]) > -1) {
                        c++;
                    }
                }
                return c === f.length;
            } else if (!f && F.length > 0) {
                return true;
            }
            return false;
        };
        a.prototype.triggerValidateFieldGroup = function (f) {
            this.fireValidateFieldGroup({fieldGroupIds: f});
        };
    })();
    return a;
});
