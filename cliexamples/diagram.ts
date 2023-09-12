import { Node, Canvas } from "@apognu/diagascode";

window.onload = () => {
  const canvas = new Canvas({
    title: "Simple diagram",
    subtitle: "Asynchronous message posting",
    defaultTemplate: "box",
    draggable: true,
    columnGap: 64,
    padding: 24,
  });

  const api = canvas.add(
    new Node(
      { col: 1, row: 1 },
      {
        icon: "/assets/pod.svg",
        function: "workload",
        title: "API",
      },
    ),
  );

  const sa = canvas.add(
    new Node(
      { col: 2, row: 1 },
      {
        icon: "/assets/identity_and_access_management.svg",
        function: "service account",
        title: "API SA",
      },
      [[api, { connection: { dashed: true } }]],
      { template: "simple-icon" },
    ),
  );

  const queue = canvas.add(
    new Node(
      { col: 2, row: 2 },
      {
        icon: "/assets/cloud_tasks.svg",
        function: "cloud tasks",
        title: "Message queue",
      },
      [
        [
          sa,
          {
            handles: { arrow: true },
            connection: { label: "Cloud Tasks Enqueuer" },
          },
        ],
      ],
    ),
  );

  const func = canvas.add(
    new Node(
      { col: 3, row: 2 },
      {
        icon: "/assets/cloud_functions.svg",
        function: "cloud function",
        title: "Dispatcher",
      },
      [[queue, { handles: { arrow: true } }]],
    ),
  );

  const sql_sa = canvas.add(
    new Node(
      { col: 3, row: 3 },
      {
        icon: "/assets/identity_and_access_management.svg",
        function: "service account",
        title: "SQL SA",
      },
      [[func, { connection: { dashed: true } }]],
      { template: "simple-icon" },
    ),
  );

  const sql = canvas.add(
    new Node(
      { col: 3, row: 4 },
      {
        icon: "/assets/cloud_sql.svg",
        function: "cloud sql",
        title: "Repository",
      },
      [[sql_sa, { handles: { arrow: true } }]],
      { background: "#cbe5df" },
    ),
  );

  canvas.draw();
};
