export async function getEstoque() {
  const url = "http://192.168.30.252:9091/api_crm/estoque/estoque.php";

  const res = await fetch(url);
  const data = await res.json();

  return data;
}
