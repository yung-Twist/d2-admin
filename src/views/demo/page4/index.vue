<template>
<d2-container >
    <template slot="header">Page 4 header</template>
    <div>Hello World</div>
    <div>Hello World</div>
    <div>Hello World</div>
    <div>Hello World</div>
    <d2-icon-svg name="myicon1"/>
    <d2-icon-svg name="d2-admin"/>
    <d2-highlight code="alert('Hello')"/>
    <template slot="footer">Footer</template>
</d2-container>
</template>

<script>
export default {
  name: 'page4',
  data () {
    return {
    }
  }
}
</script>
