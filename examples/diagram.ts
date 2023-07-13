import { Zone, Node, Canvas } from "@apognu/diagascode";

window.onload = () => {
  const canvas = new Canvas({
    title: "Hello, world!",
    subtitle: "Lorem ipsum dolor sit amet",
    draggable: true,
  });

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
        subtitle: "my-bucket/",
      },
      [[lb, { connection: { cornerRadius: 8 } }]],
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

  canvas.add(
    new Zone({ col: 1, colSpan: 1, row: 2, rowSpan: 1 }, [lb], {
      title: "global",
      background: "#dedede",
    }),
  );

  canvas.add(
    new Zone({ col: 2, colSpan: 2, row: 2, rowSpan: 2 }, [api, db, cache], {
      title: "europe-west-1",
      background: "#acded5",
    }),
  );

  canvas.draw();
};
