<template>
  <div>
    <el-row>
      <el-button
        icon="el-icon-circle-plus-outline"
        size="small"
        type="primary"
        plain
        @click="addNewOutcome(data.row._id)"
      >Add new outcome</el-button>
    </el-row>
    <el-row>
      <el-table :data="data.row.options" style="width: 100%">
        <el-table-column fixed label="Outcome" width="400">
          <template slot-scope="scope">
            <el-input placeholder="Please input" v-model="scope.row.text" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="Operations" width="120">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="deleteConfirmation(scope.row._id)">Delete</el-button>
            <el-button
              @click="updateOutcome(scope.row._id, scope.row.text)"
              type="text"
              size="small"
              :disabled="scope.row._originalText === scope.row.text"
              :loading="scope.row._isUpdating"
            >Save</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script lang="ts">
declare var process: any;

import Vue from "vue";
import Axios from "axios";
import { Component, Prop, Watch } from "vue-property-decorator";
import { buildRequestHeaders } from "../utils";
import { Decision } from "../types/decisions";
import { defaultDecisionOutcome } from "../defaults/decision";

@Component({
  components: {
    // PermissionBuilder
  }
})
export default class DecisionOutcome extends Vue {
  @Prop({ default: () => [] })
  private data!: { row: { options: Array<typeof defaultDecisionOutcome> } };

  constructor() {
    super();
    console.log(this.data);
  }

  private async updateOutcome(_id: string, text: string) {
    console.log(_id, text);
    console.log(this.data);
    // Disable save button for now
    var decisionOutcome = this.data.row.options.find(o => o._id === _id);
    if (decisionOutcome) decisionOutcome._isUpdating = true;

    // Send update to API
    const resp = await Axios(
      `${process.env.BOT_HOST}/decision/outcome/update`,
      {
        method: "POST",
        data: {
          _id: _id,
          text: text
        },
        headers: buildRequestHeaders()
      }
    );

    if (resp.status === 200) {
      if (resp.data.success === true && decisionOutcome) {
        decisionOutcome._isUpdating = false;
        decisionOutcome._isChanged = false;
        decisionOutcome._originalText = text;
      }
    }

    console.log("updateOutcome outcome =>", resp.data);
  }

  private async deleteDecisionOutcome(_id: string) {
    console.log(_id);
    const resp = await Axios(
      `${process.env.BOT_HOST}/decision/outcome/delete`,
      {
        method: "DELETE",
        data: {
          _id: _id
        },
        headers: buildRequestHeaders()
      }
    );

    console.log("deleteDecisionOutcome outcome =>", resp.data);
    // If successful remove it from the local collection
    if (resp.status === 200) {
      if (resp.data.success) {
        this.data.row.options.splice(
          this.data.row.options.findIndex(d => d._id === _id),
          1
        );
      }
    }
  }

  private async addDecitionOutcome(_id: string, text: string) {
    console.log(_id);
    const resp = await Axios(`${process.env.BOT_HOST}/decision/outcome/add`, {
      method: "POST",
      data: {
        _id: _id,
        text: text
      },
      headers: buildRequestHeaders()
    });

    console.log("addDecitionOutcome outcome =>", resp.data);
    // If successful refresh
    if (resp.status === 200) {
      if (resp.data.success) {
        // this.$emit('requestRefresh')
        // Use successful data return with _id to dynamically
        // popuplate the table
        this.data.row.options.push({
          _isUpdating: false,
          _isChanged: false,
          _originalText: resp.data.return.text,
          _deleteVisible: false,
          _id: resp.data.return.id,
          text: resp.data.return.text
        });
      }
    }
  }

  private addNewOutcome(_id: string, question: string) {
    this.$prompt("New roll outcome", question, {
      confirmButtonText: "Add",
      cancelButtonText: "Cancel"
    })
      .then(async ({ value }) => {
        this.addDecitionOutcome(_id, value);
        this.$message({
          type: "success",
          message: "New outcome: " + value
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "Input canceled"
        });
      });
  }

  private deleteConfirmation(_id: string) {
    this.$confirm(
      "This will permanently delete the file. Continue?",
      "Warning",
      {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning"
      }
    )
      .then(async () => {
        // Send delete to API
        await this.deleteDecisionOutcome(_id);

        this.$message({
          type: "success",
          message: "Delete completed"
        });
      })
      .catch(() => {
        this.$message({
          type: "info",
          message: "Delete canceled"
        });
      });
  }
}
</script>