const i18n = require('./i18n');
const { Plugin } = require('powercord/entities');
const { findInReactTree } = require('powercord/util');
const { inject, uninject } = require('powercord/injector');
const {
    getModule,
    React,
    i18n: { Messages }
} = require('powercord/webpack');

const press = new KeyboardEvent('keydown', { which: 65, keyCode: 65, shiftKey: true, ctrlKey: true, bubbles: true });
Object.defineProperties(press, { keyCode: { value: 65 }, which: { value: 65 } });

class CollapseAllCats extends Plugin {
    async startPlugin() {
        powercord.api.i18n.loadAllStrings(i18n);
        await this.injectMenu();
    }

    async injectMenu() {
        const Menu = await getModule(['MenuItem']);

        inject('collapse-cats-menu', Menu, 'default', ([{ children }], res) => {
            if (res.props.id !== 'guild-header-popout') return res;

            if (!findInReactTree(res, c => c.props && c.props.id === 'collapse-cats-menu')) {
                children.unshift(
                    React.createElement(Menu.MenuGroup, null, React.createElement(Menu.MenuItem, {
                        id: 'collapse-cats-menu',
                        label: Messages.COLLAPSE_CATEGORIES,
                        action: () => this.collapseCategories()
                    }))
                );
            }
            return res;
        });

        Menu.default.displayName = 'Menu';
    }

    collapseCategories() {
        document.body.dispatchEvent(press);
    }

    pluginWillUnload() {
        uninject('collapse-cats-menu');
        uninject('collapse-cats-context-menu');
    }
}

module.exports = CollapseAllCats;