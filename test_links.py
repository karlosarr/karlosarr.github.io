import re

def test_no_broken_links():
    """
    Analiza los archivos _sidebar.md y falla si encuentra enlaces rotos que apunten a '/#'.
    """
    errors = []
    sidebar_files = ["docs/_sidebar.md", "docs/es-mx/_sidebar.md"]

    for filepath in sidebar_files:
        with open(filepath, 'r') as f:
            content = f.read()
            # Buscar enlaces de markdown que apunten a /#
            broken_links = re.findall(r'\[.*\]\(\/\#\)', content)
            if broken_links:
                errors.append(f"Error: Se encontraron enlaces rotos en {filepath}: {', '.join(broken_links)}")

    if errors:
        # Unir todos los errores en un único mensaje y fallar la aserción
        error_message = "\n".join(errors)
        assert not errors, error_message

if __name__ == "__main__":
    test_no_broken_links()
    print("¡Éxito! No se encontraron enlaces rotos.")
