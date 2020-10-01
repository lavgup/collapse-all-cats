const { Plugin } = require('powercord/entities');
const { findInReactTree } = require('powercord/util');
const { getModule, React } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');

const press = new KeyboardEvent('keydown', { which: 65, keyCode: 65, shiftKey: true, ctrlKey: true, bubbles: true });
Object.defineProperties(press, { keyCode: { value: 65 }, which: { value: 65 } });

class CollapseAllCats extends Plugin {
    async startPlugin() {
        await this.injectMenu();
        await this.injectContextMenu();
    }

    async injectMenu() {
        const Menu = await getModule(['MenuItem']);

        inject('collapse-cats-menu', Menu, 'default', ([{ children }], res) => {
            if (res.props.id !== 'guild-header-popout') return res;

            if (!findInReactTree(res, c => c.props && c.props.id === 'collapse-cats-menu')) {
                children.unshift(
                    React.createElement(Menu.MenuGroup, null, React.createElement(Menu.MenuItem, {
                        id: 'collapse-cats-menu',
                        label: 'Collapse Categories',
                        action: () => this.collapseCategories()
                    }))
                );
            }
            return res;
        });

        Menu.default.displayName = 'Menu';
    }

    async injectContextMenu() {
        const { MenuGroup, MenuItem } = await getModule(['MenuItem']);
        const GuildContextMenu = await getModule(m => m.default && m.default.displayName === 'GuildContextMenu');

        inject('collapse-cats-context-menu', GuildContextMenu, 'default', (args, res) => {
            res.props.children.unshift(
                React.createElement(MenuGroup, {},
                    React.createElement(MenuItem, {
                        id: 'collapse-cats-context-menu',
                        key: 'collapse-cats',
                        label: 'Collapse Categories',
                        action: () => this.collapseCategories()
                    })
                )
            );
            return res;
        });

        GuildContextMenu.default.displayName = 'GuildContextMenu';
    }

    collapseCategories() {
        document.body.dispatchEvent(press);
    }

    pluginWillUnload() {
        uninject('collapse-cats-menu');
        uninject('collapse-cats-context-menu')
    }
}

module.exports = CollapseAllCats;