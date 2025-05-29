// Aqui estamos importando dois recuros necessários do Angular para criar um Pipe
// PipeTransform é a interface que nosso Pipe vai implementar
import { Pipe, PipeTransform } from '@angular/core';

// Aqui temos um decorador @ que define esta classe como um Pipe Angular
@Pipe({
  // é o nome que usaremos no template ex:(qualquer coisa | filter)
  name: 'filter'
})
// a classe implements PipeTransform, exige o método transform()
export class FilterPipe implements PipeTransform {

  // Então precisamos do método transform()
  /*
    * Método principal que transforma os dados
    * @param items - Lista original de itens (array de strings)
    * @param searchText - Texto digitado para filtrar
    * @returns Lista filtrada de itens (array de strings)
  */
  transform(items: string[], searchText: string): string[] {
    // Se items for null/undefined, retorna array vazio
    // Aqui estamos evitando erros, caso não passamos nenhum dados;
    if (!items) return [];

    // Se não houver texto de busca ou for vazio, retorna todos os itens
    // Ou seja, não vamos aplicar nenhum filtro
    if (!searchText) return items;
    
    // Converte o texto de busca para minúsculas
    // Estamos fazendo isso para temos busca case-insensitive (ignorar maiúsculas/minúsculas)
    searchText = searchText.toLowerCase();

    // Agora sim vamos filtrar os itens:
    // Primeiro: Converte cada item para minúsculas
    // Segundo: Verifica se o item inclui o texto de busca
    // Por fim, retorna apenas os itens que passaram no teste
    return items.filter(item => 
      item.toLowerCase().includes(searchText)
    );
  }

}
