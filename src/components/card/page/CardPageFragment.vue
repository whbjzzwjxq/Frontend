<template>
    <v-card flat outlined tile>
        <v-card-title class="pa-0 px-2" style="height: 32px;">
            <div class="d-flex flex-row">
                <field-title
                    :text="fragment.Info.Name"
                    :edit-mode="editMode"
                    :font-css="fontCSS"
                    @update-text="updateValue('Name', $event)">

                </field-title>
                <v-spacer></v-spacer>
                <icon-group :icon-list="iconList" small>

                </icon-group>
            </div>
        </v-card-title>
        <v-card-text class="pa-2" style="">
            <field-text
                v-if="label === 'text'"
                :base-text="fragment.Info.Description"
                :prop-name="'Description'"
                :editable="editMode"
                :width="'100%'"
                @update-value="updateValue">

            </field-text>
            <v-img v-else-if="label === 'image'" :src="fragment.Info.Src">

            </v-img>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
    import Vue from 'vue'
    import {getIcon} from "@/utils/icon";
    import IconGroup from "@/components/IconGroup.vue";
    import FieldText from "@/components/field/FieldText.vue";
    import FieldArray from "@/components/field/FieldArray.vue";
    import FieldTitle from "@/components/field/FieldTitle.vue";
    import {FragmentInfoPart} from "@/class/info";

    export default Vue.extend({
        name: "CardPageFragment",
        components: {
            IconGroup,
            FieldText,
            FieldArray,
            FieldTitle
        },
        data: function () {
            return {
                editMode: false,
                fontCSS: {
                    fontSize: "large",
                    fontWeight: "bold"
                } as CSSProp
            }
        },
        props: {
            baseFragment: {
                type: Object as () => FragmentInfoPart,
                required: true
            }
        },
        computed: {
            fragment: function (): FragmentInfoPart {
                return this.baseFragment
            },
            label: function (): string {
                return this.fragment._label
            },
            iconList: function (): IconItem[] {
                return [
                    {name: getIcon('i-edit', 'edit'), _func: this.edit},
                    {name: getIcon('i-edit', 'delete'), _func: this.deleteFragment},
                    {name: getIcon('i-arrow-double', 'right'), _func: this.exportFragment},
                    {name: getIcon('i-edit', 'save'), _func: this.saveFragment}
                ]
            },
        },
        methods: {
            edit() {
                this.editMode = !this.editMode
            },
            deleteFragment() {
                this.$emit('fragment-delete', this.fragment)
            },
            exportFragment() {
                this.$emit('fragment-add-to-graph', this.fragment)
            },
            saveFragment() {
                this.$emit('fragment-save', this.fragment)
            },
            updateValue(propName: string, newValue: any) {
                this.fragment.updateValue(propName, newValue)
            }
        },
        record: {
            status: 'empty',
            description: ''
        }
    })
</script>

<style scoped>

</style>
