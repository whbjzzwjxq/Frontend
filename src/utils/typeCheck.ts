import {
    BaseLinkInfo,
    BaseMediaInfo,
    BaseNodeInfo, BaseType,
    BooleanConcern,
    LevelConcern, LinkInfoPartBackend,
    LinkSettingPart,
    MediaSettingPart, NodeInfoPartBackend, NodeSettingPart, NoteSettingPart,
    SettingPart,
    VisualNodeSettingPart
} from "@/utils/graphClass";

export function isNodeBackend(item: NodeInfoPartBackend | LinkInfoPartBackend): item is NodeInfoPartBackend {
    let type = (item as NodeInfoPartBackend).Info.type;
    return type === 'node' || type === 'document'
}

export function isNodeInfoPart(item: BaseNodeInfo | BaseMediaInfo | BaseLinkInfo): item is BaseNodeInfo {
    return (item as BaseNodeInfo).type === 'node' ||
        (item as BaseNodeInfo).type === 'document'
}

export function isBaseType(str: string): str is BaseType {
    return (str as BaseType) === 'node' ||
        (str as BaseType) === 'link' ||
        (str as BaseType) === 'media' ||
        (str as BaseType) === 'document' ||
        (str as BaseType) === 'note'
}

export function isLinkSetting(item: SettingPart): item is LinkSettingPart {
    return (item as LinkSettingPart).Setting._type === 'link'
}

export function isMediaSetting(item: SettingPart): item is MediaSettingPart {
    return (item as MediaSettingPart).Setting._type === 'media'
}

export function isNodeSetting(item: SettingPart): item is NodeSettingPart {
    return (item as NodeSettingPart).Setting._type === 'node' || (item as NodeSettingPart).Setting._type === 'document'
}

export function isNoteSetting(item: SettingPart): item is NoteSettingPart {
    return (item as NoteSettingPart).Setting._type === 'note'
}

export function isBooleanConcern(prop: LevelConcern | BooleanConcern | "Labels"): prop is BooleanConcern {
    return (
        prop === "isStar" || prop === "isBad" || prop === "isGood" || prop === "isShared"
    );
}

export function isLevelConcern(prop: LevelConcern | BooleanConcern | "Labels"): prop is LevelConcern {
    return prop === "Imp" || prop === "HardLevel" || prop === "Useful";
}