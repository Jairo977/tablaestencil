import { Component, Prop, State, h } from '@stencil/core';

@Component({
  tag: 'my-table',
  styleUrl: 'my-table.css',
  shadow: true,
})
export class MyTable {
  @Prop() apiUrl: string = '';  // Recibe la URL como una propiedad
  @State() data: any[] = [];
  @State() error: string = '';

  handleInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.apiUrl = input.value;  // Actualiza la URL con la entrada del usuario
  }

  async fetchData() {
    if (!this.apiUrl) {
      this.error = 'Por favor, ingrese una URL válida';
      return;
    }

    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error('No se pudo obtener los datos');
      }
      this.data = await response.json();
      this.error = '';
    } catch (error) {
      this.error = error.message;
      this.data = [];
    }
  }

  componentWillLoad() {
    if (this.apiUrl) {
      this.fetchData();  // Si `apiUrl` está definido, carga los datos al montar el componente
    }
  }

  render() {
    return (
      <div>
        <input
          type="text"
          placeholder="Ingrese la URL de la API"
          onInput={(event) => this.handleInputChange(event)}
          value={this.apiUrl}  // Muestra la URL actual
        />
        <button onClick={() => this.fetchData()}>Cargar Datos</button>

        {this.error && <div>Error: {this.error}</div>}

        {this.data.length > 0 ? (
          <table>
            <thead>
              <tr>
                {Object.keys(this.data[0]).map(key => (
                  <th>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {this.data.map(item => (
                <tr>
                  {Object.values(item).map(value => (
                    <td>{typeof value === 'object' ? JSON.stringify(value) : value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          !this.error && <div>Ingrese una URL y haga clic en "Cargar Datos".</div>
        )}
      </div>
    );
  }
}
