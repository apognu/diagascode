import { Node, Canvas, Zone } from "@apognu/diagascode";

window.onload = () => {
  const canvas = new Canvas({
    title: "Simple diagram",
    subtitle: "Asynchronous message posting",
    defaultTemplate: "box",
    draggable: true,
    columnGap: 96,
    rowGap: 96,
    padding: 56,
    baseFontSize: 16,
  });

  const api = canvas.add(
    new Node(
      { col: 1, row: 1, spanRow: 2 },
      {
        icon: "/assets/pod.svg",
        function: "workload",
        title: "API",
        subtitle: "Message producer",
      },
    ),
  );

  const sa = canvas.add(
    new Node(
      { col: 2, row: 1 },
      {
        icon: "/assets/identity_and_access_management.svg",
        function: "service account",
        title: "Service account",
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
            handles: { arrow: true, size: 2 },
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

  canvas.add(
    new Zone(
      { col: 1, row: 1, colSpan: 3, rowSpan: 2 },
      [api, sa, queue, func],
      { title: "Europe", background: "#addeec" },
    ),
  );

  const sqlSa = canvas.add(
    new Node(
      { col: 3, row: 3 },
      {
        icon: "/assets/identity_and_access_management.svg",
        function: "service account",
        title: "Service account",
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
      [
        [
          sqlSa,
          {
            connection: { label: "CloudSQL Client" },
            handles: { arrow: true },
          },
        ],
      ],
      { background: "#cbe5df" },
    ),
  );

  const website = canvas.add(
    new Node(
      { col: 1, row: 4 },
      {
        icon: "/assets/pod.svg",
        function: "workload",
        title: "Website",
        subtitle: "End consumer",
      },
      [
        [
          sql,
          {
            handles: { arrow: true, direction: "peer" },
          },
        ],
      ],
    ),
  );

  canvas.draw();
};
