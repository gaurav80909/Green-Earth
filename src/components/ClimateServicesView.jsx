import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, Shield, Leaf, BarChart, Globe, 
  ArrowRight, CheckCircle2, Users, FileText, 
  Zap, X, ExternalLink, MessageSquare, CloudSun
} from 'lucide-react';
import RiskAssessmentView from './RiskAssessmentView';
import SustainabilityConsultingView from './SustainabilityConsultingView';
import CustomForecastingView from './CustomForecastingView';
import PolicyImpactView from './PolicyImpactView';

const serviceDetails = {
  "Risk Assessment": {
    heroTitle: "Precision Risk Analytics",
    tagline: "Quantifying climate vulnerability for resilient infrastructure.",
    icon: Shield,
    color: "#10b981",
    description: "Our Risk Assessment service leverages high-resolution climate models and geospatial data to identify and quantify environmental threats. We help organizations transition from reactive disaster management to proactive resilience planning.",
    features: [
      { title: "Flood Risk Mapping", desc: "Predictive modeling for urban and rural coastal areas." },
      { title: "Heatwave Projection", desc: "Advanced thermal analysis for Urban Heat Islands." },
      { title: "Vulnerability Audits", desc: "Structural and operational vulnerability detection." },
      { title: "Scenario Planning", desc: "Simulating impacts under 1.5°C to 4.0°C scenarios." }
    ],
    benefits: ["Reduce insurance premiums", "Comply with global standards", "Protect critical assets"],
    useCases: ["City planning", "Asset management", "Emergency response"]
  },
  "Sustainability Consulting": {
    heroTitle: "Strategic Green Transition",
    tagline: "Accelerating the journey to Net Zero with data-driven strategy.",
    icon: Leaf,
    color: "#3b82f6",
    description: "We provide end-to-end consulting services to help businesses decarbonize their operations and supply chains. We turn environmental responsibility into a competitive advantage.",
    features: [
      { title: "Carbon Footprinting", desc: "Scope 1, 2, and 3 emissions tracking and auditing." },
      { title: "ESG Roadmapping", desc: "Strategies for Environmental and Governance excellence." },
      { title: "Energy Transition", desc: "Guidance on switching to renewable energy sources." },
      { title: "Circular Economy", desc: "Redesigning waste out of your business lifecycle." }
    ],
    benefits: ["Attract green investment", "Operational cost savings", "Future-proof business"],
    useCases: ["Manufacturing", "Global retail", "Financial sector"]
  },
  "Custom Forecasting": {
    heroTitle: "Hyper-Local Intelligence",
    tagline: "AI-powered predictive models for atmospheric precision.",
    icon: CloudSun,
    color: "#f59e0b",
    description: "Our Custom Forecasting service uses proprietary AI models to provide micro-climate predictions with up to 98% accuracy for localized operations.",
    features: [
      { title: "High-Res Weather", desc: "1km x 1km resolution forecasting for assets." },
      { title: "Atmospheric Simulation", desc: "Real-time modeling of wind patterns and air quality." },
      { title: "ML Prediction", desc: "Models trained on decades of regional data." },
      { title: "Telemetry Integration", desc: "Connects with on-site IoT sensors." }
    ],
    benefits: ["Optimize logistics", "Prevent asset damage", "Enhanced air quality monitoring"],
    useCases: ["Precision agriculture", "Renewable energy", "Construction"]
  },
  "Policy Impact Analysis": {
    heroTitle: "Regulatory Intelligence",
    tagline: "Simulating the intersection of economics and environment.",
    icon: FileText,
    color: "#8b5cf6",
    description: "We provide deep-dive analysis on how regional and international regulations will impact economic stability and operational compliance.",
    features: [
      { title: "Carbon Tax Simulation", desc: "Predicting financial impacts of pricing models." },
      { title: "Compliance Audits", desc: "Evaluating operations against future laws." },
      { title: "Macro-Economic Modeling", desc: "Assessing GDP and employment shifts." },
      { title: "Policy Optimization", desc: "Data-driven recommendations for targets." }
    ],
    benefits: ["Mitigate legal risks", "Informed budgeting", "Align with global goals"],
    useCases: ["Governments", "NGO advocacy", "Corporate legal teams"]
  }
};

const ServiceModal = ({ serviceName, onClose }) => {
  const detail = serviceDetails[serviceName];
  if (!detail) return null;
  const Icon = detail.icon;

  return (
    <div className="modal-overlay-custom" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="modal-content-premium" 
        onClick={e => e.stopPropagation()}
      >
        <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
        
        <div className="modal-header-premium">
          <div className="service-icon-box" style={{ backgroundColor: `${detail.color}20`, marginBottom: 0 }}>
            <Icon size={40} style={{ color: detail.color }} />
          </div>
          <div>
            <h2 className="modal-title-text" style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>{detail.heroTitle}</h2>
            <p style={{ color: 'var(--primary)', fontWeight: 700 }}>{detail.tagline}</p>
          </div>
        </div>

        <div className="modal-body-premium">
          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
            {detail.description}
          </p>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Zap size={22} color="var(--primary)" /> Key Features
          </h3>
          <div className="feature-grid-custom">
            {detail.features.map((f, i) => (
              <div key={i} className="feature-item-card">
                <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>{f.title}</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{f.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginTop: '3rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.2rem' }}>Strategic Benefits</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {detail.benefits.map((b, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.8rem', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                    <CheckCircle2 size={16} color="var(--primary)" /> {b}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.2rem' }}>Use Cases</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {detail.useCases.map((u, i) => (
                  <span key={i} style={{ padding: '0.4rem 0.8rem', background: 'var(--surface-hover)', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}>{u}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer-premium">
          <div className="cta-group">
            <button className="btn-primary-cta">Get Consultation</button>
            <button className="btn-secondary-cta">View Analytics</button>
          </div>
          <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Contact Team <ArrowRight size={18} />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const ClimateServicesView = () => {
  const [selectedService, setSelectedService] = useState(null);

  const services = [
    { title: "Risk Assessment", desc: "Detailed analysis of climate-related risks for specific regions.", icon: Shield, color: "#10b981" },
    { title: "Sustainability Consulting", desc: "Expert guidance on reducing carbon footprint and ESG reporting.", icon: Leaf, color: "#3b82f6" },
    { title: "Custom Forecasting", desc: "High-resolution weather and climate predictions for business planning.", icon: CloudSun, color: "#f59e0b" },
    { title: "Policy Impact Analysis", desc: "Simulating the effects of environmental regulations on local economies.", icon: FileText, color: "#8b5cf6" }
  ];

  if (selectedService === "Risk Assessment") {
    return <RiskAssessmentView onClose={() => setSelectedService(null)} />;
  }
  if (selectedService === "Sustainability Consulting") {
    return <SustainabilityConsultingView onClose={() => setSelectedService(null)} />;
  }
  if (selectedService === "Custom Forecasting") {
    return <CustomForecastingView onClose={() => setSelectedService(null)} />;
  }
  if (selectedService === "Policy Impact Analysis") {
    return <PolicyImpactView onClose={() => setSelectedService(null)} />;
  }
  if (selectedService) {
    return <ServiceModal serviceName={selectedService} onClose={() => setSelectedService(null)} />;
  }

  return (
    <div className="services-container">
      <header className="services-header">
        <div className="services-badge">
          <Briefcase size={16} /> Enterprise Solutions
        </div>
        <h1 className="services-title">Advanced Climate <br /> <span>Intelligence Services</span></h1>
        <p className="services-subtitle">
          Empowering governments and global organizations with high-precision environmental analytics and strategic consulting.
        </p>
      </header>

      <div className="services-grid">
        {services.map((service, i) => {
          const Icon = service.icon;
          return (
            <div key={i} className="service-card-premium">
              <div className="service-icon-box" style={{ backgroundColor: `${service.color}15` }}>
                <Icon size={32} style={{ color: service.color }} />
              </div>
              <h3 className="service-card-title">{service.title}</h3>
              <p className="service-card-desc">{service.desc}</p>
              <div className="service-card-footer">
                <button className="learn-more-btn" onClick={() => setSelectedService(service.title)}>
                  Learn More <ExternalLink size={16} />
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <div style={{ display: 'flex', marginLeft: '0.5rem' }}>
                     {[1,2,3].map(j => (
                       <div key={j} style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--border)', border: '2px solid var(--surface)', marginLeft: '-8px', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
                         <Users size={12} color="var(--text-muted)" />
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClimateServicesView;
