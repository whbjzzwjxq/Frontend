import Vue from 'vue'
import {RectByPoint} from "@/utils/geoMetric";
import {commitBottomDynamicBarResize, commitViewBoxResize} from "@/store/modules/_mutations";
import {instance} from "@/api/main";

declare global {
    interface StyleManagerState {
        screenX: number,
        screenY: number,
        viewBox: RectByPoint,
        toolBar: ToolBar,
        leftCard: LeftCard,
        bottomBar: BottomBar,
        bottomDynamicBar: RectByPoint,
        leftCardTab: {
            root: number,
            sub: number
        }
    }

    interface ComponentSize {
        width: number | string,
        height: number | string,

        [propName: string]: number | string
    }

    type RootTabName = 'ecoSystem' | 'document' | 'metaKnowledge';
    type EcoTabName = 'knownMap' | 'community' | 'course';
    type DocumentTabName = 'directory' | 'historyBranch' | 'comments';
    type MetaKnowledgeTabName = 'info' | 'mediaList' | 'relative'
    type SubTabName = EcoTabName | DocumentTabName | MetaKnowledgeTabName
}

interface LeftCard extends ComponentSize {
    width: number
    height: number
}

interface BottomBar extends ComponentSize {
    width: string
    height: number,
}

interface ToolBar extends ComponentSize {
    width: string
    height: number,
}

export const tabDict: Record<RootTabName, string[]> = {
    'ecoSystem': [
        "knownMap",
        "community",
        "course"
    ] as EcoTabName[],
    'document': [
        "directory",
        "historyBranch",
        "comments"
    ] as DocumentTabName[],
    "metaKnowledge": [
        "info",
        "mediaList",
        "relative"
    ] as MetaKnowledgeTabName[]
};

const rootTabIndex: RootTabName[] = ["ecoSystem", "document", "metaKnowledge"];

const state: StyleManagerState = {
    toolBar: {
        width: '100%',
        height: 48
    },
    leftCard: {
        width: 400,
        height: document.documentElement.clientHeight - 48
    },
    bottomBar: {
        width: '100%',
        height: 108
    },
    bottomDynamicBar: new RectByPoint({x: 0, y: document.documentElement.clientHeight - 240}, {x: 0, y: 0}, 0),
    screenX: document.documentElement.clientWidth,
    screenY: document.documentElement.clientHeight,
    viewBox: new RectByPoint({x: 0, y: 0}, {x: 0, y: 0}, 2),
    leftCardTab: {
        root: 0,
        sub: 0
    }

};

const mutations = {
    resetScreen: (state: StyleManagerState) => {
        state.screenX = document.documentElement.clientWidth;
        state.screenY = document.documentElement.clientHeight;
        commitViewBoxResize();
        commitBottomDynamicBarResize();
    },

    resetLeftCard: (state: StyleManagerState, payload: number) => {
        Vue.set(state.leftCard, 'width', payload);
        commitViewBoxResize();
        commitBottomDynamicBarResize();
    },

    resetBottomBar: (state: StyleManagerState, payload: number) => {
        Vue.set(state.bottomBar, 'height', payload);
    },

    getViewBox: (state: StyleManagerState) => {
        // 计算ViewBox
        state.viewBox.start.update({x: state.leftCard.width, y: state.toolBar.height});
        state.viewBox.end.update({x: state.screenX, y: state.screenY})
    },

    getBottomDynamicBar: (state: StyleManagerState, payload?: number) => {
        if (payload) {
            payload <= state.toolBar.height && (payload = state.toolBar.height); // 最高
            payload >= state.screenY - 240 && (payload = state.screenY - 240); // 最矮
        } else {
            (payload = state.screenY - 240) // doNothing
        }
        state.bottomDynamicBar.start.update({x: state.leftCard.width, y: payload});
        state.bottomDynamicBar.end.update({x: state.screenX, y: state.screenY})
    },

    changeRootTab: (state: StyleManagerState, payload: RootTabName | number) => {
        typeof payload === 'number'
        ? state.leftCardTab.root = payload
        : state.leftCardTab.root = rootTabIndex.indexOf(payload);
        state.leftCardTab.sub = 0
    },

    changeSubTab: (state: StyleManagerState, payload: SubTabName) => {
        let root = 'document' as RootTabName;
        let sub = 0;
        Object.entries(tabDict).map(([key, nameList]) => {
            let index = nameList.indexOf(payload);
            if (index > -1) {
                sub = index;
                root = key as RootTabName
            } else {
                //
            }
        });
        state.leftCardTab.root = rootTabIndex.indexOf(root);
        state.leftCardTab.sub = sub
    }

};
const actions = {};
const getters = {};

export default {
    state,
    mutations,
    actions,
    getters
}
