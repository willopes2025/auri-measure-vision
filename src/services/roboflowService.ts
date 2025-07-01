
export interface RoboflowDetection {
  x: number;
  y: number;
  width: number;
  height: number;
  class: string;
  confidence: number;
}

export interface RoboflowResponse {
  predictions: RoboflowDetection[];
  image: {
    width: number;
    height: number;
  };
}

export interface ExtractedMeasurements {
  distancia_intermamilar: number;
  altura_mamilo_sulco: number;
  projecao_mamaria: number;
  largura_base_mama: number;
  altura_mama: number;
}

export class RoboflowService {
  private apiKey: string;
  private modelEndpoint: string;

  constructor(apiKey: string, modelEndpoint: string) {
    this.apiKey = apiKey;
    this.modelEndpoint = modelEndpoint;
  }

  async analyzeImage(imageFile: File | string): Promise<RoboflowResponse> {
    const formData = new FormData();
    
    if (imageFile instanceof File) {
      formData.append('file', imageFile);
    } else {
      // Se for URL, baixar a imagem primeiro
      const response = await fetch(imageFile);
      const blob = await response.blob();
      formData.append('file', blob, 'image.jpg');
    }

    const response = await fetch(this.modelEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Roboflow API error: ${response.statusText}`);
    }

    return await response.json();
  }

  convertDetectionsToMeasurements(
    detections: RoboflowDetection[],
    cmPerPixel: number,
    imageWidth: number,
    imageHeight: number
  ): ExtractedMeasurements {
    // Mapear classes do Roboflow para nossas medidas
    const classMap: { [key: string]: string } = {
      'mamilo_direito': 'mamilo_d',
      'mamilo_esquerdo': 'mamilo_e',
      'base_mama_direita': 'base_d',
      'base_mama_esquerda': 'base_e',
      'sulco_inframamario_direito': 'sulco_d',
      'sulco_inframamario_esquerdo': 'sulco_e',
      'linha_media': 'linha_media'
    };

    // Organizar detecções por classe
    const landmarks: { [key: string]: { x: number; y: number } } = {};
    
    detections.forEach(detection => {
      const mappedClass = classMap[detection.class] || detection.class;
      landmarks[mappedClass] = {
        x: detection.x,
        y: detection.y
      };
    });

    // Calcular medidas baseadas nos landmarks detectados
    const measurements: ExtractedMeasurements = {
      distancia_intermamilar: 0,
      altura_mamilo_sulco: 0,
      projecao_mamaria: 0,
      largura_base_mama: 0,
      altura_mama: 0,
    };

    // Distância intermamilar
    if (landmarks.mamilo_d && landmarks.mamilo_e) {
      const distance = Math.sqrt(
        Math.pow(landmarks.mamilo_d.x - landmarks.mamilo_e.x, 2) +
        Math.pow(landmarks.mamilo_d.y - landmarks.mamilo_e.y, 2)
      );
      measurements.distancia_intermamilar = parseFloat((distance * cmPerPixel).toFixed(1));
    }

    // Altura mamilo-sulco (lado direito como exemplo)
    if (landmarks.mamilo_d && landmarks.sulco_d) {
      const distance = Math.abs(landmarks.mamilo_d.y - landmarks.sulco_d.y);
      measurements.altura_mamilo_sulco = parseFloat((distance * cmPerPixel).toFixed(1));
    }

    // Largura da base da mama (lado direito como exemplo)
    if (landmarks.base_d) {
      // Estimativa baseada na largura da detecção da base
      const baseDetection = detections.find(d => classMap[d.class] === 'base_d');
      if (baseDetection) {
        measurements.largura_base_mama = parseFloat((baseDetection.width * cmPerPixel).toFixed(1));
      }
    }

    // Altura da mama (lado direito como exemplo)
    if (landmarks.mamilo_d && landmarks.base_d) {
      const distance = Math.abs(landmarks.mamilo_d.y - landmarks.base_d.y);
      measurements.altura_mama = parseFloat((distance * cmPerPixel).toFixed(1));
    }

    // Projeção mamária (estimativa baseada na profundidade aparente)
    if (landmarks.mamilo_d && landmarks.linha_media) {
      const distance = Math.abs(landmarks.mamilo_d.x - landmarks.linha_media.x);
      measurements.projecao_mamaria = parseFloat((distance * cmPerPixel * 0.8).toFixed(1)); // Fator de correção para profundidade
    }

    return measurements;
  }

  calculateScaleFromRuler(detections: RoboflowDetection[]): number | null {
    // Procurar por detecção de régua
    const rulerDetection = detections.find(d => 
      d.class.toLowerCase().includes('ruler') || 
      d.class.toLowerCase().includes('regua')
    );

    if (rulerDetection) {
      // Assumindo que a régua tem 10cm e foi detectada corretamente
      const rulerPixelWidth = rulerDetection.width;
      return 10 / rulerPixelWidth; // 10cm dividido pela largura em pixels
    }

    return null;
  }
}
