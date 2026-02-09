import {
  Globe,
  MapPin,
  Briefcase,
  BookOpen,
  Smile,
  Clock,
  Zap,
  Infinity,
  Users,
  Music,
  Tv,
  Trophy,
  Star,
  UtensilsCrossed,
  Tag,
  Drama,
  Wine,
  CookingPot,
  Mic,
  Sparkles,
  MessageCircle,
  ShoppingCart,
  Map,
  Disc3,
  Monitor,
  Stethoscope,
  BarChart3,
  Settings,
  Scale,
  GraduationCap,
  User,
  Scroll,
  BookMarked,
  Landmark,
  Church,
  Bird,
  PawPrint,
  Film,
  Shield,
  Gamepad2,
  IceCreamCone,
  Backpack,
  Flame,
  Check,
  X,
  Lock,
  Pause,
  Play,
  ChevronLeft,
  Package,
  FolderOpen,
  Target,
  Wand2,
  PartyPopper,
  HelpCircle,
  type LucideProps,
} from 'lucide-react';
import type { ComponentType } from 'react';

const iconMap: Record<string, ComponentType<LucideProps>> = {
  // Word Pack icons
  'map-pin': MapPin,
  'globe': Globe,
  'briefcase': Briefcase,
  'book-open': BookOpen,
  'smile': Smile,

  // Game Mode icons
  'clock': Clock,
  'zap': Zap,
  'infinity': Infinity,
  'users': Users,

  // Category icons
  'music': Music,
  'tv': Tv,
  'trophy': Trophy,
  'star': Star,
  'utensils': UtensilsCrossed,
  'tag': Tag,
  'drama': Drama,
  'wine': Wine,
  'cooking-pot': CookingPot,
  'mic': Mic,
  'sparkles': Sparkles,
  'message-circle': MessageCircle,
  'shopping-cart': ShoppingCart,
  'map': Map,
  'disc': Disc3,
  'monitor': Monitor,
  'stethoscope': Stethoscope,
  'bar-chart': BarChart3,
  'settings': Settings,
  'scale': Scale,
  'graduation-cap': GraduationCap,
  'user': User,
  'scroll': Scroll,
  'book-marked': BookMarked,
  'landmark': Landmark,
  'church': Church,
  'bird': Bird,
  'paw-print': PawPrint,
  'film': Film,
  'shield': Shield,
  'gamepad': Gamepad2,
  'ice-cream': IceCreamCone,
  'backpack': Backpack,

  // UI icons
  'flame': Flame,
  'check': Check,
  'x': X,
  'lock': Lock,
  'pause': Pause,
  'play': Play,
  'chevron-left': ChevronLeft,
  'package': Package,
  'folder-open': FolderOpen,
  'target': Target,
  'wand': Wand2,
  'party-popper': PartyPopper,
  'help-circle': HelpCircle,
};

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 20, className = '', strokeWidth = 2 }: IconProps) {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    return <HelpCircle size={size} className={className} strokeWidth={strokeWidth} />;
  }

  return <IconComponent size={size} className={className} strokeWidth={strokeWidth} />;
}
