import Vue from 'vue'
export interface ComponentSize {
  width: number | string,
  height: number | string,
  [propName: string]: number | string
}

interface LeftCard extends ComponentSize {
  width: number
}

interface BottomBar extends ComponentSize {
  height: number
}

export interface ToolBar extends ComponentSize{
  height: number
}

export interface StyleManagerState {
  screenX: number,
  screenY: number,
  toolBar: ToolBar,
  leftCard: LeftCard,
  bottomBar: BottomBar
}

const state: StyleManagerState = {
  toolBar: {
    width: '100%',
    height: 48
  },
  leftCard: {
    width: 420,
    height: '100%'
  },
  bottomBar: {
    width: '100%',
    height: 48
  },
  screenX: document.documentElement.clientWidth,
  screenY: document.documentElement.clientHeight
};

const mutations = {
  resetScreen: (state: StyleManagerState) => {
    state.screenX = document.documentElement.clientWidth;
    state.screenY = document.documentElement.clientHeight;
  },

  resetLeftCard: (state: StyleManagerState, payload: number) => {
    Vue.set(state.leftCard, 'width', payload)
  }
};
const actions = {};
const getters = {
  viewBox: (state: StyleManagerState) => {
    return <ComponentSize>{
      width: state.screenX - state.leftCard.width,
      height: state.screenY - state.bottomBar.height - state.toolBar.height
    }
  }
};

export default {
  state,
  mutations,
  actions,
  getters
}
