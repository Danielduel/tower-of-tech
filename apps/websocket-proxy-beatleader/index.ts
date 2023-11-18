export default {
  async fetch(request: Request, env: any) {
      try {
          return new Response('hi')
      } catch (e) {
          return new Response(e.message)
      }
  },
};
