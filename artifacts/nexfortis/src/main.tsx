import "./index.css";

const root = document.getElementById("root")!;
root.innerHTML = '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center"><div style="width:2rem;height:2rem;border:4px solid #00b4d8;border-top-color:transparent;border-radius:50%;animation:spin 1s linear infinite"></div></div><style>@keyframes spin{to{transform:rotate(360deg)}}</style>';

import("./app-root").then(({ mount }) => mount(root));
