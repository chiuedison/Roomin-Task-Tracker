<template>
  <div class="groups-wrapper flex flex-column">
    <h1>Create or Join a Group!</h1>
    <div class="groups flex">
      <div class="input flex flex-column">
        <label for="join-group">Join Group</label>
        <input type="text" id="join-group" placeholder="Group Code" />
      </div>
      <div class="create-group flex flex-column">
        <p>Don't have a group yet? Create one here!</p>
        <button @click="createGroup" class="purple">Create Group</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Groups",
  data() {},
};
</script>

<style lang="scss" scoped>
* {
  /*border: 1px solid black;*/
}

.groups-wrapper {
  margin-top: 32px;
  align-items: center;
  gap: 24px;

  .input {
    align-items: center;
    gap: 8px;
    flex: 1;
  }

  .create-group {
    align-items: center;
    text-align: center;
    gap: 8px;
    flex: 1;
    width: 500px;
  }
}
</style>
