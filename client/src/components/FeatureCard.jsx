import React from 'react';
import { cn } from '../lib/utils';

const FeatureCard = ({ icon, title, description, className }) => {
    return (
        <div className={cn(
            "flex flex-col items-center text-center p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300",
            className
        )}>
            <div className="mb-4 text-4xl">{icon}</div>
            <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        </div>
    );
};

export default FeatureCard;
