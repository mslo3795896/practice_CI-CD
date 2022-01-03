import { mapState, mapGetters, mapActions } from 'vuex'

export const authComputed = {
  ...mapState('auth', {
    currentUser: (state) => state.currentUser,
  }),
  ...mapGetters('auth', ['loggedIn']),
};

export const menuComputed = {
  ...mapState('menu', {
    currentMenu: (state) => state.cachedMenu,
  }),
};

export const setComputed = {
  ...mapState('set', {
    currentLanguage: (state) => state.cachedLanguage,
  }),
};

export const brandComputed = {
  ...mapState('brand', {
    currentBrand: (state) => state.cachedBrand,
  }),
};

export const globalComputed = {
  ...mapState('global', {
    currentMenuSolution: (state) => state.menuSolution,
    currentMenuProduct: (state) => state.menuProduct,
    currentMenuBrand: (state) => state.menuBrand,
    currentSetting: (state) => state.currentSetting
  }),
};
