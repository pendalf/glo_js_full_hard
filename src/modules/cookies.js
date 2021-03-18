const cookie = {

    // метод установки cookie
    set(name, value, options = {}) {

        options = {
            path: '/',
            // при необходимости добавьте другие значения по умолчанию
            ...options
        };

        if (options.expires instanceof Date) {
            options.expires = options.expires.toUTCString();
        }

        let updatedCookie = encodeURIComponent(name) + "=" + JSON.stringify(value);

        for (const optionKey in options) {
            updatedCookie += "; " + optionKey;
            const optionValue = options[optionKey];
            if (optionValue !== true) {
                updatedCookie += "=" + optionValue;
            }
        }

        document.cookie = updatedCookie;
    },

    // метод удаления cookie
    delete(name) {
        this.setCookie(name, "", {
            'max-age': -1
        });
    },

    // Метод получения cookie
    get(name) {
        const matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? JSON.parse(matches[1]) : undefined;
    }
};

export default cookie;