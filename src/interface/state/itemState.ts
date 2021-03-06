export default {}
declare global {
    interface BaseState {
        isDeleted: boolean; // 是否被删除;
        [prop: string]: boolean;
    }

    interface DocumentItemState extends BaseState {
        isSelected: boolean; // 是否被选中
        isMouseOn: boolean; // 是否鼠标放置在上面
        isInRow: boolean; //是否已经进入Row
    }

    interface NodeState extends DocumentItemState {

    }

    interface LinkState extends DocumentItemState {
        // 暂时和Node一样
    }

    interface MediaState extends DocumentItemState {

    }

    interface NoteState extends DocumentItemState {
        isLock: boolean; //是否锁定
        isDark: boolean; //是否暗化
        isEditing: boolean; // 是否正在编辑
    }

    interface TextState extends DocumentItemState {
        isEditing: boolean;
    }

    interface DocumentState extends BaseState {
        isSaved: boolean; //是否保存
        isExplode: boolean; // 是否爆炸
    }

    interface PaperSectionState {
        isSelected: boolean
        isDeleted: boolean
    }
}
