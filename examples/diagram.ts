import { Zone, Node, Canvas } from "@apognu/diagascode/src/lib";

window.onload = () => {
  const canvas = new Canvas();

  const user = new Node(
    { col: 1, row: 4 },
    {
      icon: "my_cloud.svg",
      title: "User",
    },
    [],
    { template: "simple-icon" },
  );

  const lb = canvas.add(
    new Node(
      { col: 1, row: 2 },
      {
        icon: "cloud_load_balancing.svg",
        function: "cloud load balancer",
        title: "Ingress",
        subtitle: "api.example.com",
      },
      [
        [
          user,
          {
            connection: { color: "#989898" },
            handles: { sourceColor: "#989898", destColor: "#989898" },
          },
        ],
      ],
    ),
  );

  const api = canvas.add(
    new Node(
      { col: lb.col + 1, row: lb.row },
      {
        icon: "pod.svg",
        function: "deployment",
        title: "Main API",
        subtitle: "3 instances",
      },
      [lb],
    ),
  );

  const bucket = canvas.add(
    new Node(
      { col: lb.col + 1, row: lb.row - 1 },
      {
        icon: "cloud_storage.svg",
        function: "bucket",
        title: "Uploaded files",
      },
      [lb],
    ),
  );

  const db = canvas.add(
    new Node(
      { col: api.col + 1, row: api.row },
      {
        icon: "cloud_sql.svg",
        function: "cloud sql",
        title: "Database",
      },
      [[api, { connection: { dashed: true }, handles: { arrow: true } }]],
    ),
  );

  const cache = canvas.add(
    new Node(
      { col: api.col, row: api.row + 1 },
      {
        icon: "memorystore.svg",
        function: "memory store",
        title: "Cache",
      },
      [[api, { connection: { dashed: true }, handles: { arrow: true } }]],
    ),
  );

  const global = canvas.add(
    new Zone(
      { col: 1, colSpan: 1, row: 2, rowSpan: 1 },
      { title: "global", background: "#dedede" },
    ),
  );

  const ew1 = canvas.add(
    new Zone(
      { col: 2, colSpan: 2, row: 2, rowSpan: 2 },
      { title: "europe-west-1", background: "#acded5" },
    ),
  );

  canvas.draw();
};
