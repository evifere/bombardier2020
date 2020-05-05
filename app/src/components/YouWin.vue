<template>
  <div class="hello">
    <h1>Congratulations You win \0/</h1>
    <p>
        You score was {{ getScore }}
    </p>
    <p>
        <el-button type="primary" plain @click="()=>$router.push('game')">Start Again</el-button>
    </p>
  </div>
</template>

<script>
export default {
  name: 'youwin',

  computed:{
      getScore:function (){
          return localStorage.getItem('score');
      }
  }
}
</script>

