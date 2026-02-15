import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Lightbulb,
  Search,
  PenTool,
  Wrench,
  FileText,
  Award,
  ArrowRight,
  Sparkles,
  Target,
  Shield,
} from "lucide-react";

const steps = [
  { icon: Lightbulb, title: "问题发现", desc: "从生活中发现真实问题" },
  { icon: Search, title: "背景调研", desc: "调查现有方案和用户需求" },
  { icon: PenTool, title: "方案设计", desc: "设计创新的解决方案" },
  { icon: Wrench, title: "原型开发", desc: "动手制作可运行的原型" },
  { icon: FileText, title: "文档撰写", desc: "撰写研究论文和报告" },
  { icon: Award, title: "成果展示", desc: "准备竞赛答辩材料" },
];

const features = [
  {
    icon: Sparkles,
    title: "AI智能引导",
    desc: "AI助手像一位耐心的导师，通过提问引导学生独立思考，而不是直接给答案。",
  },
  {
    icon: Target,
    title: "11步完整流程",
    desc: "从发现问题到参加竞赛，经过验证的方法论确保每个学生都能走完全程。",
  },
  {
    icon: Shield,
    title: "三层保障机制",
    desc: "AI提示 → 案例参考 → 老师介入，学生永远不会被卡住。",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto max-w-6xl flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">零一优创</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                登录
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">免费注册</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto max-w-6xl px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm px-4 py-1.5 rounded-full mb-6">
          <Sparkles className="w-4 h-4" />
          AI驱动的科创引导平台
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          让每个孩子都能完成
          <br />
          <span className="text-primary">属于自己的科创项目</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          零一优创通过AI智能引导，带领中小学生从发现生活中的真实问题开始，
          一步步完成科技创新项目，产出完整的竞赛材料。
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/register">
            <Button size="lg">
              开始科创之旅
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg">
              了解更多
            </Button>
          </Link>
        </div>
      </section>

      {/* Steps Overview */}
      <section className="bg-card border-y py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-bold text-center mb-2">
            科学的11步方法论
          </h2>
          <p className="text-muted-foreground text-center mb-10">
            经过多年实践验证，每一步都有明确的产出物
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {steps.map((step, i) => (
              <Card key={i} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-medium text-sm mb-1">{step.title}</h3>
                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">
          为什么选择零一优创
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary/5 border-t py-16">
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">准备好开始了吗？</h2>
          <p className="text-muted-foreground mb-6">
            免费注册，立即开始你的第一个科创项目
          </p>
          <Link href="/register">
            <Button size="lg">
              免费注册
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground">
          <p>零一优创 (One Up) · AI驱动的科创引导平台</p>
        </div>
      </footer>
    </div>
  );
}
