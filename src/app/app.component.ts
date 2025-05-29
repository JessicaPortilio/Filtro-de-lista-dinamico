import { CommonModule } from '@angular/common'; // Módulo com diretivas comuns ex(*ngIf, *ngFor)
import { Component, OnInit } from '@angular/core'; // Para criar componentes
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'; // Para formulários
import { FilterPipe } from './filter.pipe'; // Nosso pipe de filtro personalizado
import { debounceTime, distinctUntilChanged } from 'rxjs'; // Para operações reativas
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'; // Para segurança de HTML


@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, FilterPipe, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  // Controlador do campo de busca (input)
  // FormControl é como um "supervisor" do campo de texto
  searchControl = new FormControl(''); // lembrando ele começa vazio
  // Lista que armazenará os itens filtrados
  filteredItems: string[] = [];

  // Lista completa de tutoriais (nossa "base de dados")
  // obs: lembre-se isso poderia vim de um API
  items: string[] = [
    'Aprendendo CSS Grid',
    'CSS Flexbox em Detalhes',
    'Construindo com HTML e CSS',
    'Fundamentos de Acessibilidade Web',
    'Noções básicas de JavaScript',
    'Conceitos Avançados de JavaScript',
    'O Guia Completo de JavaScript',
    'Introdução ao Node.js',
    'Desenvolvimento Web com Node.js',
    'Node.js para Iniciantes',
  ];

  // Injeção do serviço que protege contra códigos maliciosos
  constructor(private sanitizer: DomSanitizer) {}

  // Método que roda quando o componente é carregado
  ngOnInit() {
    // Inicializa a lista filtrada com todos os itens
    this.filteredItems = [...this.items]; // [...] cria uma cópia

    // Configura o "ouvinte" do campo de busca
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300), // Espera 300ms após a última digitação
        distinctUntilChanged() // Só executa se o texto mudou
      )
      .subscribe(searchText => {
        // Quando o usuário digita, filtra os itens
        this.filterItems(searchText || ''); // Usa '' se for null/undefined
      });
  }

  /*
    * Filtra os itens conforme o texto digitado
    * @param searchText Texto para filtrar os itens
  */
  filterItems(searchText: string) {
    // Se não tiver texto, mostra todos os itens
    if (!searchText) {
      this.filteredItems = [...this.items];
      return;
    }

    // Padroniza a busca para minúsculas
    searchText = searchText.toLowerCase();
    
    // Filtra os itens que contêm o texto buscado
    this.filteredItems = this.items.filter(item =>
      item.toLowerCase().includes(searchText)
    );
  }

  /*
    * Destaca o texto buscado nos resultados
    * @param text Texto completo do item
    * @param search Termo buscado
    * @returns Texto com o termo destacado (seguro para HTML)
  */
  highlightText(text: string, search: string): SafeHtml {
    // Se não tiver termo de busca, retorna o texto normal
    if (!search) return text;
    
    // Protege contra caracteres especiais no termo buscado
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Cria uma expressão regular para encontrar o termo (ignorando maiúsculas)
    const regex = new RegExp(`(${escapedSearch})`, 'gi');

    // Substitui o termo encontrado por um span com classe highlight
    const highlighted = text.replace(regex, '<span class="highlight">$1</span>');
    
    // Marca o HTML como seguro para evitar bloqueio do Angular
    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }
}
