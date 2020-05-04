<template>
  <div class="hello">
    <h1>You loose</h1>
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
  name: 'gameover',

  computed:{
      getScore:function (){
          return localStorage.getItem('score');
      }
  }
}
</script>

