describe("gettext", function () {

    beforeAll(function () {
        StoneTest.index.clearCatalogs();
        StoneTest.index.addCatalogs(CATALOGS);
    });

    describe("setLocale", function () {

        it("can switches the locale", function () {
            StoneTest.index.setLocale("fr");
            expect(StoneTest.index.getLocale()).toEqual("fr");
        });

    });

    describe("listCatalogs", function () {

        it("can list all the catalogs", function () {
            StoneTest.index.listCatalogs();
            expect(StoneTest.index.listCatalogs()).toContain("fr");
            expect(StoneTest.index.listCatalogs()).toContain("en");
            expect(StoneTest.index.listCatalogs()).toContain("it");
            expect(StoneTest.index.listCatalogs().length).toEqual(3);
        });

    });

    describe("setBestMatchingLocale", function () {

        beforeAll(function () {
            StoneTest.index.addCatalogs({
                // en, fr, it +
                fr_FR: {},
                fr_ca: {},
                "fr-be": {},
                pt_BR: {},
                es_ES: {},
                es_AR: {},
                de: {},
                foolang: {}
            });
        });

        beforeEach(function () {
            StoneTest.gettext.setLocale("c");
        });

        it("accepts a single string", function () {
            StoneTest.gettext.setBestMatchingLocale("fr");
            expect(StoneTest.index.getLocale()).toEqual("fr");
        });

        it("accepts an array of string", function () {
            StoneTest.gettext.setBestMatchingLocale(["fr"]);
            expect(StoneTest.index.getLocale()).toEqual("fr");
        });

        it("selects 'c' as locale if nothing matches", function () {
            StoneTest.gettext.setBestMatchingLocale("foobarbaz");
            expect(StoneTest.index.getLocale()).toEqual("c");
        });

        it("selects the right language with a perfect matching", function () {
            StoneTest.gettext.setBestMatchingLocale("fr");
            expect(StoneTest.index.getLocale()).toEqual("fr");

            StoneTest.gettext.setBestMatchingLocale("FR");
            expect(StoneTest.index.getLocale()).toEqual("fr");

            StoneTest.gettext.setBestMatchingLocale("fr_FR");
            expect(StoneTest.index.getLocale()).toEqual("fr_FR");

            StoneTest.gettext.setBestMatchingLocale("fr_fr");
            expect(StoneTest.index.getLocale()).toEqual("fr_FR");

            StoneTest.gettext.setBestMatchingLocale("fr-fr");
            expect(StoneTest.index.getLocale()).toEqual("fr_FR");

            StoneTest.gettext.setBestMatchingLocale("fr-be");
            expect(StoneTest.index.getLocale()).toEqual("fr-be");

            StoneTest.gettext.setBestMatchingLocale("fr_BE");
            expect(StoneTest.index.getLocale()).toEqual("fr-be");
        });

        it("selects the right language with a partial match (language provided but no lect)", function () {
            StoneTest.gettext.setBestMatchingLocale("it");
            expect(StoneTest.index.getLocale()).toEqual("it");

            StoneTest.gettext.setBestMatchingLocale("es");
            expect(StoneTest.index.getLocale()).toEqual("es_ES");

            StoneTest.gettext.setBestMatchingLocale("pt");
            expect(StoneTest.index.getLocale()).toEqual("pt_BR");
        });

        it("selects the right language with a partial match (language provided with lect)", function () {
            StoneTest.gettext.setBestMatchingLocale("de_LU");
            expect(StoneTest.index.getLocale()).toEqual("de");

            StoneTest.gettext.setBestMatchingLocale("pt_PT");
            expect(StoneTest.index.getLocale()).toEqual("pt_BR");
        });

        it("selects the best matching language from a list", function () {
            StoneTest.gettext.setBestMatchingLocale(["es", "es_AR", "fr_FR"]);
            expect(StoneTest.index.getLocale()).toEqual("es_AR");

            StoneTest.gettext.setBestMatchingLocale(["es", "fr_FR"]);
            expect(StoneTest.index.getLocale()).toEqual("es_ES");
        });

        it("selects the right catalogs with wrong locale names", function () {
            StoneTest.gettext.setBestMatchingLocale(["foolang"]);
            expect(StoneTest.index.getLocale()).toEqual("foolang");
        });

        it("selects the 'c' language if nothing matches", function () {
            StoneTest.gettext.setBestMatchingLocale(["fr"]);
            expect(StoneTest.index.getLocale()).toEqual("fr");

            StoneTest.gettext.setBestMatchingLocale(["xxx"]);
            expect(StoneTest.index.getLocale()).toEqual("c");
        });

    });

    describe("gettext", function () {

        it("can translates strings", function () {
            StoneTest.index.setLocale(null);
            expect(StoneTest.index.gettext("Hello World")).toEqual("Hello World");
            StoneTest.index.setLocale("xx");
            expect(StoneTest.index.gettext("Hello World")).toEqual("Hello World");
            StoneTest.index.setLocale("en");
            expect(StoneTest.index.gettext("Hello World")).toEqual("Hello World");
            StoneTest.index.setLocale("fr");
            expect(StoneTest.index.gettext("Hello World")).toEqual("Bonjour le monde");
            StoneTest.index.setLocale("it");
            expect(StoneTest.index.gettext("Hello World")).toEqual("Buongiorno il mondo");
        });

        it("can translates strings with replacements", function () {
            StoneTest.index.setLocale(null);
            expect(StoneTest.index.gettext("Hello {name}", {name: "John"})).toEqual("Hello John");
            StoneTest.index.setLocale("xx");
            expect(StoneTest.index.gettext("Hello {name}", {name: "John"})).toEqual("Hello John");
            StoneTest.index.setLocale("en");
            expect(StoneTest.index.gettext("Hello {name}", {name: "John"})).toEqual("Hello John");
            StoneTest.index.setLocale("fr");
            expect(StoneTest.index.gettext("Hello {name}", {name: "John"})).toEqual("Bonjour John");
            StoneTest.index.setLocale("it");
            expect(StoneTest.index.gettext("Hello {name}", {name: "John"})).toEqual("Buongiorno John");
        });

    });

    describe("lazyGettext", function () {

        it("can translates strings", function () {
            var s = StoneTest.index.lazyGettext("Hello World");
            StoneTest.index.setLocale(null);
            expect(String(s)).toEqual("Hello World");
            StoneTest.index.setLocale("fr");
            expect(String(s)).toEqual("Bonjour le monde");
        });

        it("can translates  strings with replacements", function () {
            var s = StoneTest.index.lazyGettext("Hello {name}", {name: "John"});
            StoneTest.index.setLocale(null);
            expect(String(s)).toEqual("Hello John");
            StoneTest.index.setLocale("fr");
            expect(String(s)).toEqual("Bonjour John");
        });

    });

    describe("LazyString", function () {

        beforeAll(function () {
            StoneTest.index.setLocale("fr");
        });

        beforeEach(function () {
            this.lazy = new StoneTest.index.LazyString("Hello World");
        });

        it("can translate text", function () {
            expect(this.lazy.toString()).toEqual("Bonjour le monde");
        });

        it("can mimic the String API", function () {
            var stringProps = Object.getOwnPropertyNames(String.prototype);
            var lazyProps = Object.getOwnPropertyNames(this.lazy);
            for (var i = 0 ; i < stringProps.length ; i++) {
                expect(lazyProps).toContain(stringProps[i]);
            }
        });

        it("can give the translated string length", function () {
            expect(this.lazy.length).toEqual(16);
        });

        it("can return the translated string in lowerCase", function () {
            expect(this.lazy.toLowerCase()).toEqual("bonjour le monde");
        });

        it("can return a splitted translated string", function () {
            expect(this.lazy.split(" ")).toEqual(["Bonjour", "le", "monde"]);
        });

    });

    describe("catalogs", function () {

        beforeAll(function () {
            StoneTest.index.clearCatalogs();
            StoneTest.index.addCatalogs({
                fr: {
                    "plural-forms": "nplurals=2; plural=(n > 1);",
                    messages: {
                        Hello: ["Bonjour"],
                        World: ["Monde"]
                    }
                },
                it: {
                    "plural-forms": "nplurals=2; plural=(n != 1);",
                    messages: {
                        Hello: ["Buongiorno"]
                    }
                }
            });

            StoneTest.index.addCatalogs({
                fr: {
                    "plural-forms": "nplurals=2; plural=(n > 1);",
                    messages: {
                        Hello: ["Salut"]
                    }
                },
                en: {
                    "plural-forms": "nplurals=2; plural=(n != 1);",
                    messages: {
                        Hello: ["Hi"]
                    }
                }
            });
        });

        it("are merged when multi-source are added", function () {
            StoneTest.index.setLocale("fr");
            expect(StoneTest.index.gettext("Hello")).toEqual("Salut");
            expect(StoneTest.index.gettext("World")).toEqual("Monde");

            StoneTest.index.setLocale("it");
            expect(StoneTest.index.gettext("Hello")).toEqual("Buongiorno");

            StoneTest.index.setLocale("en");
            expect(StoneTest.index.gettext("Hello")).toEqual("Hi");
        });

    });

});
