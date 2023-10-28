import Routing from "./routing.tsx";
import Layout from "./pages/Layout.tsx";

export default function ShellApp() {
  return (
    <main>
      <Layout>
        <Routing />
      </Layout>
    </main>
  );
}
