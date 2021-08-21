<template>
  <router-link
    class="task flex"
    :to="{ name: 'Task', params: { taskID: task.taskID } }"
  >
    <div class="left flex">
      <span class="tracking-number">#{{ task.taskID }}</span>
      <span class="due-date">{{ task.paymentDueDate }}</span>
      <span class="person">{{ task.clientName }}</span>
    </div>
    <div class="right flex">
      <span class="price">${{ task.taskTotal }}</span>
      <div
        class="status-button flex"
        :class="{
          paid: task.taskPaid,
          draft: task.taskDraft,
          pending: task.taskPending,
        }"
      >
        <span v-if="task.taskPaid">Paid</span>
        <span v-if="task.taskDraft">Draft</span>
        <span v-if="task.taskPending">Pending</span>
      </div>
      <div class="icon">
        <img src="@/assets/icon-arrow-right.svg" alt="">
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  name: "task",
  props: ["task"],
};
</script>

<style lang="scss" scoped>
.task {
  text-decoration: none;
  cursor: pointer;
  gap: 16px;
  margin-bottom: 16px;
  color: white;
  border-radius: 20px;
  padding: 28px 32px;
  background-color: #1e2139;
  align-items: center;

  span {
    font-size: 14px;
  }

  .left {
    align-items: center;
    flex-basis: 60%;
    gap: 16px;

    span {
      flex: 1;
    }

    .tracking-number {
      text-transform: uppercase;
    }
  }

  .right {
    gap: 16px;
    flex-basis: 40%;
    align-items: center;

    .price {
      flex: 1;
      font-size: 16px;
      font-weight: 600;
    }
  }
}
</style>
