class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanhoTotal: 10, animais: [{ especie: 'MACACO', quantidade: 3 }] },
            { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animais: [] },
            { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animais: [{ especie: 'GAZELA', quantidade: 1 }] },
            { numero: 4, bioma: 'rio', tamanhoTotal: 8, animais: [] },
            { numero: 5, bioma: 'savana', tamanhoTotal: 9, animais: [{ especie: 'LEAO', quantidade: 1 }] },
        ];

        this.animais = {
            'LEAO': { tamanho: 3, biomas: ['savana'], carnivoro: true },
            'LEOPARDO': { tamanho: 2, biomas: ['savana'], carnivoro: true },
            'CROCODILO': { tamanho: 3, biomas: ['rio'], carnivoro: true },
            'MACACO': { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
            'GAZELA': { tamanho: 2, biomas: ['savana'], carnivoro: false },
            'HIPOPOTAMO': { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false },
        };
    }

    analisaRecintos(animal, quantidade) {
        // Verifica se o animal é válido
        if (!this.animais[animal]) {
            return { erro: "Animal inválido" };
        }
    
        // Verifica se a quantidade é válida
        if (quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }
    
        const { tamanho, biomas, carnivoro } = this.animais[animal];
        // Calcula o tamanho necessário, incluindo espaço extra se necessário
        const tamanhoNecessario = tamanho * quantidade;
    
        const recintosViaveis = this.recintos.filter(recinto => {
            // Verifica se o bioma do recinto é adequado
            if (!biomas.includes(recinto.bioma) && !(animal === 'HIPOPOTAMO' && recinto.bioma === 'savana e rio')) {
                return false;
            }
    
            // Calcula o espaço já ocupado no recinto
            const espacoOcupado = recinto.animais.reduce((acc, a) => acc + this.animais[a.especie].tamanho * a.quantidade, 0);
    
            // Calcula se há espaço extra necessário
            const espacoComMaisDeUmaEspecie = (recinto.animais.length > 0 && recinto.animais.some(a => a.especie !== animal)) ? 1 : 0;
            const espacoLivre = recinto.tamanhoTotal - espacoOcupado - espacoComMaisDeUmaEspecie;
    
            // Verifica se o recinto tem espaço suficiente
            if (espacoLivre < tamanhoNecessario) {
                return false;
            }
    
            // Verifica se há animais carnívoros e se está misturando espécies
            if (carnivoro && recinto.animais.length > 0) {
                return false;
            }
    
            // Regras para macacos (precisam de companhia)
            if (animal === 'MACACO' && quantidade === 1 && recinto.animais.length === 0) {
                return false;
            }
    
            // Regras para macacos já existentes
            if (recinto.animais.some(a => a.especie === 'MACACO') && recinto.animais.length === 1 && animal !== 'MACACO') {
                return false;
            }
    
            // Evita misturar carnívoros com outros
            if (recinto.animais.some(a => this.animais[a.especie].carnivoro)) {
                return false;
            }
    
            // Armazena o espaço ocupado para uso na função map
            recinto.espacoOcupado = espacoOcupado;
            return true;
        }).map(recinto => `Recinto ${recinto.numero} (espaço livre: ${recinto.tamanhoTotal - (recinto.espacoOcupado + tamanhoNecessario)} total: ${recinto.tamanhoTotal})`);
    
        // Verifica se encontrou recintos viáveis
        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }
    
        return { recintosViaveis };
    }
    
    }

export { RecintosZoo as RecintosZoo };
