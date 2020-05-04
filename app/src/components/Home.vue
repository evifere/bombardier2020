<template>
  <div class="hello">
    <h1>Welcome to bombardier 2020</h1>
    <p>
        Left click to launch bomb
    </p>
    <p>
        <el-button type="primary" plain @click="()=>$router.push('game')">Start</el-button>
    </p>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

