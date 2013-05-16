var CSSCoverage = (function(srcToCSSP, $){
    
    return function () {
        var _aCSSAST,
            _sCSS;
    
        /**
         * Set CSS.
         * 
         * @param sCSS {string} To be covered CSS.
         */
        function setCSS(sCSS) {
            _sCSS = sCSS;
        }
        
        /**
         * Get CSS AST.
         * @returns CSSAST {array} Parsed CSS as AST includes coverage.
         */
        function getCSSAST() {
            return _aCSSAST;
        }
        
        /**
         * Based on the cssp.translator. 
         */
        function queryHTML() {
    
            var _m_simple = {
                    'unary': 1, 'nth': 1, 'combinator': 1, 'ident': 1, 'number': 1, 's': 1,
                    'string': 1, 'attrselector': 1, 'operator': 1, 'raw': 1, 'unknown': 1
                },
                _m_composite = {
                    'dimension': 1, 'selector': 1, 'property': 1, 'value': 1,
                    'filterv': 1, 'progid': 1, 'ruleset': 1, 'atruleb': 1, 'atrulerq': 1, 'atrulers': 1,
                    'stylesheet': 1
                },
                _m_primitive = {
                    'cdo': 'cdo', 'cdc': 'cdc', 'decldelim': ';', 'namespace': '|', 'delim': ','
                },
                hasInfo = true;
    
            function _t(tree) {
                var t = tree[hasInfo? 1 : 0];
                if (t in _m_primitive) return _m_primitive[t];
                else if (t in _m_simple) return _simple(tree);
                else if (t in _m_composite) return _composite(tree);
                return _unique[t](tree);
            }
    
            function _composite(t, i) {
                var s = '';
                i = i === undefined ? (hasInfo? 2 : 1) : i;
                for (; i < t.length; i++) s += _t(t[i]);
                return s;
            }
    
            function _simple(t) {
                return t[hasInfo? 2 : 1];
            }
    
            var _unique = {
                simpleselector: function(t){
                    console.log("[ccs.coverage] _unique simpleselector : " + _composite(t) + $(_composite(t)).length);
                    if (hasInfo) {
                        t[0].coverage = typeof t[0].coverage !== "undefined" ? t[0].coverage + $(_composite(t)).length : $(_composite(t)).length;
                    }
                    return _composite(t);
                }, 
                percentage: function(t) {
                    return _t(t[hasInfo? 2 : 1]) + '%';
                },
                comment: function (t) {
                    return '/*' + t[hasInfo? 2 : 1] + '*/';
                },
                clazz: function(t) {
                    return '.' + _t(t[hasInfo? 2 : 1]);
                },
                atkeyword: function(t) {
                    return '@' + _t(t[hasInfo? 2 : 1]);
                },
                shash: function (t) {
                    return '#' + t[hasInfo? 2 : 1];
                },
                vhash: function(t) {
                    return '#' + t[hasInfo? 2 : 1];
                },
                attrib: function(t) {
                    return '[' + _composite(t) + ']';
                },
                important: function(t) {
                    return '!' + _composite(t) + 'important';
                },
                nthselector: function(t) {
                    return ':' + _simple(t[hasInfo? 2 : 1]) + '(' + _composite(t, hasInfo? 3 : 2) + ')';
                },
                funktion: function(t) {
                    return _simple(t[hasInfo? 2 : 1]) + '(' + _composite(t[hasInfo? 3: 2]) + ')';
                },
                declaration: function(t) {
                    return _t(t[hasInfo? 2 : 1]) + ':' + _t(t[hasInfo? 3 : 2]);
                },
                filter: function(t) {
                    return _t(t[hasInfo? 2 : 1]) + ':' + _t(t[hasInfo? 3 : 2]);
                },
                block: function(t) {
                    return '{' + _composite(t) + '}';
                },
                braces: function(t) {
                    return t[hasInfo? 2 : 1] + _composite(t, hasInfo? 4 : 3) + t[hasInfo? 3 : 2];
                },
                atrules: function(t) {
                    return _composite(t) + ';';
                },
                atruler: function(t) {
                    return _t(t[hasInfo? 2 : 1]) + _t(t[hasInfo? 3 : 2]) + '{' + _t(t[hasInfo? 4 : 3]) + '}';
                },
                pseudoe: function(t) {
                    return '::' + _t(t[hasInfo? 2 : 1]);
                },
                pseudoc: function(t) {
                    return ':' + _t(t[hasInfo? 2 : 1]);
                },
                uri: function(t) {
                    return 'url(' + _composite(t) + ')';
                },
                functionExpression: function(t) {
                    return 'expression(' + t[hasInfo? 2 : 1] + ')';
                }
            };
    
            return _t(_aCSSAST);
        }    
        
        /**
         * Execute the css coverage.
         */
        function execute() {
            // Parse the CSS as CSSAST.
            _aCSSAST = srcToCSSP(_sCSS, undefined, true);
            
            // Query selectors and store number of hits in cssAST
            queryHTML();
        }
        
        // Public
        this.setCSS = setCSS;
        this.getCSSAST = getCSSAST;
        this.execute = execute;        
    };
}(srcToCSSP, jQuery));
