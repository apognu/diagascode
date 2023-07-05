import { Node } from "@apognu/diagascode/src/lib";

window.onload = () => {
  const user = new Node(
    { col: 1, row: 4 },
    {
      icon: "my_cloud.svg",
      title: "User",
    },
    [],
    { template: "simple-icon" }
  );

  const lb = new Node(
    { col: 1, row: 2 },
    {
      icon: "cloud_load_balancing.svg",
      function: "cloud load balancer",
      title: "Ingress",
      subtitle: "api.example.com"
    },
    [[user, { connection: { color: "#989898" }, handles: { sourceColor: "#989898", destColor: "#989898" } }]],
  );

  const api = new Node(
    { col: lb.col + 1, row: lb.row },
    {
      icon: "pod.svg",
      function: "deployment",
      title: "Main API",
      subtitle: "3 instances"
    },
    [lb]
  );

  const bucket = new Node(
    { col: lb.col + 1, row: lb.row - 1 },
    {
      icon: "cloud_storage.svg",
      function: "bucket",
      title: "Uploaded files"
    },
    [lb]
  )

  const db = new Node(
    { col: api.col + 1, row: api.row },
    {
      icon: "cloud_sql.svg",
      function: "cloud sql",
      title: "Database"
    },
    [[api, { connection: { dashed: true }, handles: { arrow: true } }]],
  )

  const cache = new Node(
    { col: api.col, row: api.row + 1 },
    {
      icon: "memorystore.svg",
      function: "memory store",
      title: "Cache"
    },
    [[api, { connection: { dashed: true }, handles: { arrow: true } }]],
  )
};
