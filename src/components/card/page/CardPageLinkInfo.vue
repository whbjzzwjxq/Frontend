<template>
    <div>
        <card-sub-row text="关系信息" :close-able="editMode" v-model="settingInPaper.showTitle">
            <template v-slot:content>
                <v-col class="pt-0 pb-0 ma-0 pl-2">
                    <link-start-end-selector
                        :current-start="start"
                        :current-end="end"
                        :document="document"
                        :edit-mode="editable"
                        @select-item-link="changeNode">

                    </link-start-end-selector>
                    <v-text-field
                        :disabled="!editable"
                        :style="titleSize"
                        class="pr-2 font-weight-bold"
                        dense
                        label="PrimaryLabel"
                        v-model.lazy="pLabel">

                    </v-text-field>
                </v-col>
            </template>
        </card-sub-row>
        <card-sub-row :text="'保存与记录'" v-if="isUserControl && !editInPaper">
            <template v-slot:content>
                <div class="d-flex flex-row">
                    <v-menu offset-y>
                        <template v-slot:activator="{ on }">
                            <v-btn text v-on="on" coor="primary">Save</v-btn>
                        </template>
                        <v-list>
                            <v-list-item @click="saveItem(false)">Save and Publish</v-list-item>
                            <v-list-item @click="saveItem(true)" :disabled="!baseData.isRemote">Save as Draft
                            </v-list-item>
                        </v-list>
                    </v-menu>
                    <icon-group :icon-list="editIcon">

                    </icon-group>
                </div>
            </template>
        </card-sub-row>
        <card-sub-row text="关系标签" :close-able="editMode" v-model="settingInPaper.showLabels">
            <template v-slot:content>
                <card-sub-label-group
                    :editable="group.editable"
                    :key="index"
                    :label-items="labelItems"
                    :label-list="group.labels"
                    :name="group.name"
                    @add-label="addItem(arguments[0], group.prop)"
                    @remove-label="removeItem"
                    small
                    v-for="(group, index) in labelGroup">

                </card-sub-label-group>
            </template>
        </card-sub-row>
        <card-sub-row text="关系信息" :close-able="editMode" v-model="settingInPaper.showProps">
            <template v-slot:content>
                <field-json
                    :p-label="'link'"
                    :base-props="editProps"
                    :prop-name="'Info'"
                    :editable="editable"
                    @update-value="editProps = arguments[1]">

                </field-json>
            </template>
        </card-sub-row>
        <card-sub-row :text="'关系描述'" :close-able="editMode" v-model="settingInPaper.showDescription">
            <template v-slot:content>
                <field-text
                    :base-text="info.Description"
                    :prop-name="'Description'"
                    @update-value="updateValue(arguments[0], arguments[1])"
                >

                </field-text>
            </template>
        </card-sub-row>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'
    import CardSubRow from "@/components/card/subComp/CardSubRow.vue";
    import FieldText from "@/components/field/FieldText.vue";
    import FieldJson from "@/components/field/FieldJson.vue";
    import CardSubLabelGroup from "@/components/card/subComp/CardSubLabelGroup.vue";
    import LinkStartEndSelector from "@/components/LinkStartEndSelector.vue";
    import IconGroup from "@/components/IconGroup.vue";
    import {DocumentSelfPart} from "@/class/settingBase";
    import {EditProps, FieldType, labelItems, ResolveType} from "@/utils/fieldResolve";
    import {deepClone} from "@/utils/utils";
    import {LabelGroup} from "@/interface/interfaceInComponent";
    import {getIcon} from "@/utils/icon";
    import {linkBulkCreate, linkBulkUpdate} from '@/api/subgraph/link';
    import {LinkInfoPart} from "@/class/info";
    import {mediaShowInPaperTemplate} from "@/interface/style/templateStylePaper";

    export default Vue.extend({
        name: "CardPageLinkInfo",
        components: {
            CardSubRow,
            FieldText,
            FieldJson,
            CardSubLabelGroup,
            LinkStartEndSelector,
            IconGroup
        },
        data() {
            return {
                titleSize: "font-size: 18px",
                labelItems: labelItems,
                editBase: false
            }
        },
        props: {
            baseData: {
                type: Object as () => LinkInfoPart,
                required: true
            },
            document: {
                type: Object as () => DocumentSelfPart,
                required: true
            },
            editMode: {
                type: Boolean,
                default: false
            },
            settingInPaper: {
                type: Object as () => LinkStyleSettingPaper,
                default: () => mediaShowInPaperTemplate()
            },
            editInPaper: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            start: function (): VisNodeSettingPart {
                return this.baseData.Ctrl.Start
            },
            end: function (): VisNodeSettingPart {
                return this.baseData.Ctrl.End
            },
            info: function (): BaseLinkInfo {
                return this.baseData.Info
            },
            pLabel: {
                get(): string {
                    return this.baseData._label
                },
                set(value: string): void {
                    this.baseData.changeLabel(value)
                }
            },
            //获得ExtraProp
            editProps: {
                get(): EditProps {
                    return Object.assign({
                        ExtraProps: {
                            value: this.info.ExtraProps,
                            type: "JsonField" as FieldType,
                            resolve: "normal" as ResolveType
                        }
                    }, this.info.StandardProps)
                },
                set(value: EditProps) {
                    this.updateValue('ExtraProps', value.ExtraProps.value);
                    let StandardProps = deepClone(value);
                    // 删除掉ExtraProps
                    delete StandardProps.ExtraProps;
                    this.updateValue('StandardProps', StandardProps)
                }
            },
            labelGroup: function (): LabelGroup[] {
                return [
                    {"name": "作者的标注", "labels": this.info.Labels, "closeable": false, "editable": true, 'prop': 'Info'}
                ]
            },

            editable: function (): boolean {
                return this.editMode || this.editBase
            },

            isUserControl: function (): boolean {
                return this.baseData.isSelf
            },

            editIcon: function (): IconItem[] {
                return [{
                    name: getIcon('i-edit-able', !this.editBase),
                    disabled: !this.isUserControl,
                    _func: this.edit,
                    toolTip: !this.editBase ? '编辑内容' : '停止编辑'
                }]
            },
        },
        methods: {
            //更换Link start / end
            changeNode: function (start: VisNodeSettingPart | null, end: VisNodeSettingPart | null) {
                this.baseData.changeNode(start, end)
            },

            //更新单个值
            updateValue: function (prop: string, value: any) {
                this.baseData.updateValue(prop, value)
            },

            removeItem: function (removedLabel: string, prop: string) {
                //pass
            },

            addItem: function (value: string[], prop: string) {
                this.baseData.updateValue('Labels', value)
            },

            saveItem(isDraft: boolean, isAuto: boolean = false) {
                if (isDraft) {
                    this.baseData.draftSave(isAuto)
                } else {
                    let data = [this.baseData];
                    if (this.baseData.isRemote) {
                        linkBulkUpdate(data)
                    } else {
                        linkBulkCreate(data)
                    }
                }
            },

            edit() {
                this.editBase = !this.editBase
            }

        },
        watch: {},
        record: {
            status: 'done',
            description: "关系信息卡片"
        }
    })
</script>

<style scoped>

</style>

/**
* Created by whb on 2019/11/29
* Updated by [whb on 2020年1月8日19:16:09 第一次定稿]
*/
