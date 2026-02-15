# Diagram Generation Templates

## Overview

Use Graphviz (dot) to generate two standard diagrams for every technical document:
1. **System Architecture Diagram** (`arch_diagram.png`) — shows modules, connections, communication
2. **Flow Chart** (`flow_diagram.png`) — shows usage/test workflow with decision branches

All diagrams use Chinese labels with `Noto Sans CJK SC` font. Render at 200 dpi for print quality.

---

## Common Configuration

Every `.dot` file MUST start with these settings:

```dot
digraph G {
    rankdir=TB;
    graph [fontname="Noto Sans CJK SC", bgcolor="white", dpi=200, pad="0.3"];
    node [fontname="Noto Sans CJK SC", fontsize=11];
    edge [fontname="Noto Sans CJK SC", fontsize=9];
    
    label="项目名称 — 图表标题";
    labelloc=t;
    fontsize=18;
    fontcolor="#1a1a2e";
}
```

### Color Scheme

Use consistent colors across both diagrams:

| Role | Fill Color | Border Color | Usage |
|------|-----------|-------------|-------|
| MCU/主控芯片 | `#fff2cc` | `#d6b656` | Main processor nodes |
| 通信模块 | `#e1d5e7` | `#9673a6` | Wireless, serial, bus modules |
| 输入/输出 | `#f8cecc` | `#b85450` | Sensors, buttons, LEDs, buzzers |
| 显示模块 | `#e6d0de` | `#996185` | Screens, displays |
| 电源模块 | `#f5f5f5` | `#999999` | Batteries, power supply |
| 成功/就绪 | `#d5e8d4` | `#82b366` | Success states, ready nodes |
| 决策判断 | `#f8cecc` | `#b85450` | Diamond decision nodes |
| 开始/结束 | `#dae8fc` | `#6c8ebf` | Ellipse start/end nodes |
| 处理步骤 | `#fff2cc` | `#d6b656` | Process/action boxes |

### Graphviz Color Note

Graphviz does NOT support shorthand hex colors like `#333` or `#ccc`. Always use full 6-digit hex: `#333333`, `#cccccc`, `#999999`.

---

## Architecture Diagram Templates

### Hardware Project (e.g., sensor device, robot)

```dot
digraph arch {
    rankdir=TB;
    graph [fontname="Noto Sans CJK SC", bgcolor="white", dpi=200, pad="0.5"];
    node [fontname="Noto Sans CJK SC", shape=box, style="rounded,filled", fontsize=11];
    edge [fontname="Noto Sans CJK SC", fontsize=9];
    
    label="项目名称 — 系统架构图";
    labelloc=t; fontsize=18; fontcolor="#1a1a2e";
    
    subgraph cluster_main {
        label="主控单元";
        style="rounded,filled"; fillcolor="#dae8fc"; color="#6c8ebf"; fontsize=14;
        
        mcu [label="ESP32-S3\n主控芯片", fillcolor="#fff2cc", color="#d6b656", penwidth=2];
        sensor1 [label="传感器A\n(型号)", fillcolor="#f8cecc", color="#b85450"];
        sensor2 [label="传感器B\n(型号)", fillcolor="#f8cecc", color="#b85450"];
        actuator [label="执行器\n(型号)", fillcolor="#f8cecc", color="#b85450"];
        display [label="显示屏\n(型号)", fillcolor="#e6d0de", color="#996185"];
        power [label="锂电池 + 充电模块", fillcolor="#f5f5f5", color="#999999"];
        
        mcu -> sensor1 [label="I2C"];
        mcu -> sensor2 [label="ADC"];
        mcu -> actuator [label="PWM"];
        mcu -> display [label="SPI"];
        mcu -> power [label="供电", style=dashed, color="#999999"];
    }
    
    // Optional: wireless communication to another module
    subgraph cluster_remote {
        label="远程端";
        style="rounded,filled"; fillcolor="#d5e8d4"; color="#82b366"; fontsize=14;
        
        mcu2 [label="ESP32\n从控芯片", fillcolor="#fff2cc", color="#d6b656"];
        wireless2 [label="通信模块", fillcolor="#e1d5e7", color="#9673a6"];
    }
    
    wireless1 [label="通信模块\n(WiFi/BLE/UWB)", fillcolor="#e1d5e7", color="#9673a6"];
    mcu -> wireless1 [label="SPI"];
    wireless1 -> wireless2 [label="无线通信", dir=both, color="#9673a6", penwidth=3, style=bold];
    wireless2 -> mcu2;
}
```

### Dual-Module Hardware Project (e.g., controller + display unit)

```dot
digraph arch {
    rankdir=TB;
    graph [fontname="Noto Sans CJK SC", bgcolor="white", dpi=200, pad="0.5"];
    node [fontname="Noto Sans CJK SC", shape=box, style="rounded,filled", fontsize=11];
    edge [fontname="Noto Sans CJK SC", fontsize=9];
    
    label="项目名称 — 系统架构图";
    labelloc=t; fontsize=18; fontcolor="#1a1a2e";
    
    subgraph cluster_ctrl {
        label="模块A（描述）";
        style="rounded,filled"; fillcolor="#dae8fc"; color="#6c8ebf"; fontsize=14;
        
        mcu_a [label="MCU型号\n功能描述", fillcolor="#fff2cc", color="#d6b656", penwidth=2];
        comm_a [label="通信模块\n(角色)", fillcolor="#e1d5e7", color="#9673a6"];
        io_a1 [label="外设1", fillcolor="#f8cecc", color="#b85450"];
        io_a2 [label="外设2", fillcolor="#f8cecc", color="#b85450"];
        pwr_a [label="电源模块", fillcolor="#f5f5f5", color="#999999"];
        
        mcu_a -> comm_a [label="SPI"];
        mcu_a -> io_a1 [label="GPIO"];
        mcu_a -> io_a2 [label="PWM"];
        mcu_a -> pwr_a [label="供电", style=dashed, color="#999999"];
    }
    
    subgraph cluster_disp {
        label="模块B（描述）";
        style="rounded,filled"; fillcolor="#d5e8d4"; color="#82b366"; fontsize=14;
        
        mcu_b [label="MCU型号\n功能描述", fillcolor="#fff2cc", color="#d6b656", penwidth=2];
        comm_b [label="通信模块\n(角色)", fillcolor="#e1d5e7", color="#9673a6"];
        disp [label="显示模块", fillcolor="#e6d0de", color="#996185", penwidth=2];
        io_b1 [label="外设", fillcolor="#f8cecc", color="#b85450"];
        pwr_b [label="电源模块", fillcolor="#f5f5f5", color="#999999"];
        
        mcu_b -> comm_b [label="SPI"];
        mcu_b -> disp [label="SPI"];
        mcu_b -> io_b1 [label="GPIO"];
        mcu_b -> pwr_b [label="供电", style=dashed, color="#999999"];
    }
    
    // Wireless link between modules
    comm_a -> comm_b [label="无线通信\n（功能描述）", dir=both,
        color="#9673a6", penwidth=3, style=bold, constraint=false];
    
    // Legend
    subgraph cluster_legend {
        label="图例"; style="rounded,filled"; fillcolor="#fafafa"; color="#cccccc"; fontsize=11;
        node [fontsize=9, width=1.2, height=0.3];
        l1 [label="主控芯片", fillcolor="#fff2cc", color="#d6b656"];
        l2 [label="通信模块", fillcolor="#e1d5e7", color="#9673a6"];
        l3 [label="输入/输出", fillcolor="#f8cecc", color="#b85450"];
        l4 [label="显示模块", fillcolor="#e6d0de", color="#996185"];
        l5 [label="电源模块", fillcolor="#f5f5f5", color="#999999"];
        l1 -> l2 -> l3 -> l4 -> l5 [style=invis];
    }
}
```

### Software / IoT Project (e.g., app + cloud + device)

```dot
digraph arch {
    rankdir=TB;
    graph [fontname="Noto Sans CJK SC", bgcolor="white", dpi=200, pad="0.5"];
    node [fontname="Noto Sans CJK SC", shape=box, style="rounded,filled", fontsize=11];
    edge [fontname="Noto Sans CJK SC", fontsize=9];
    
    label="项目名称 — 系统架构图";
    labelloc=t; fontsize=18; fontcolor="#1a1a2e";
    
    subgraph cluster_device {
        label="设备层"; style="rounded,filled"; fillcolor="#dae8fc"; color="#6c8ebf";
        dev [label="硬件设备\nESP32 + 传感器", fillcolor="#fff2cc", color="#d6b656"];
    }
    
    subgraph cluster_cloud {
        label="云端层"; style="rounded,filled"; fillcolor="#e1d5e7"; color="#9673a6";
        server [label="MQTT服务器", fillcolor="#e1d5e7", color="#9673a6"];
        db [label="数据库\n(SQLite/MySQL)", fillcolor="#f5f5f5", color="#999999"];
        server -> db [label="存储"];
    }
    
    subgraph cluster_app {
        label="应用层"; style="rounded,filled"; fillcolor="#d5e8d4"; color="#82b366";
        app [label="手机APP\n/网页前端", fillcolor="#d5e8d4", color="#82b366"];
    }
    
    dev -> server [label="WiFi/MQTT\n上传数据", color="#9673a6"];
    server -> app [label="推送通知\n数据展示", color="#82b366"];
    app -> server [label="远程控制", style=dashed, color="#999999"];
}
```

---

## Flow Chart Templates

### Standard Device Usage Flow

```dot
digraph flow {
    rankdir=TB;
    graph [fontname="Noto Sans CJK SC", bgcolor="white", dpi=200, pad="0.3"];
    node [fontname="Noto Sans CJK SC", fontsize=11];
    edge [fontname="Noto Sans CJK SC", fontsize=10];
    
    label="项目名称 — 使用流程图";
    labelloc=t; fontsize=18; fontcolor="#1a1a2e";
    
    // Start/End
    node [shape=ellipse, style=filled, fillcolor="#dae8fc", color="#6c8ebf", fontsize=12];
    start [label="开始"];
    end_ [label="结束"];
    
    // Process steps
    node [shape=box, style="rounded,filled", fillcolor="#fff2cc", color="#d6b656"];
    s1 [label="步骤1：开机初始化"];
    s2 [label="步骤2：传感器校准"];
    s3 [label="步骤3：数据采集"];
    s4 [label="步骤4：数据处理"];
    
    // Success states
    node [fillcolor="#d5e8d4", color="#82b366"];
    ok [label="系统就绪"];
    result [label="显示结果"];
    
    // Error/retry
    node [fillcolor="#f5f5f5", color="#999999"];
    retry [label="重试/调整"];
    
    // Decision diamonds
    node [shape=diamond, style=filled, fillcolor="#f8cecc", color="#b85450", fontsize=10];
    d1 [label="校准\n通过？"];
    d2 [label="数据\n有效？"];
    
    // Flow
    start -> s1 -> s2 -> d1;
    d1 -> ok [label="是", color="#82b366", fontcolor="#82b366"];
    d1 -> retry [label="否", color="#b85450", fontcolor="#b85450"];
    retry -> s2 [style=dashed, color="#999999"];
    ok -> s3 -> s4 -> d2;
    d2 -> result [label="是", color="#82b366", fontcolor="#82b366"];
    d2 -> s3 [label="否", color="#b85450", fontcolor="#b85450", style=dashed];
    result -> end_;
}
```

### Testing Flow with Multiple Rounds

```dot
digraph flow {
    rankdir=TB;
    graph [fontname="Noto Sans CJK SC", bgcolor="white", dpi=200, pad="0.3"];
    node [fontname="Noto Sans CJK SC", fontsize=11];
    edge [fontname="Noto Sans CJK SC", fontsize=10];
    
    label="项目名称 — 测试流程图";
    labelloc=t; fontsize=18; fontcolor="#1a1a2e";
    
    // Start/End
    node [shape=ellipse, style=filled, fillcolor="#dae8fc", color="#6c8ebf"];
    start [label="开始"]; end_ [label="结束"];
    
    // Steps
    node [shape=box, style="rounded,filled", fillcolor="#fff2cc", color="#d6b656"];
    init [label="系统初始化\n设备自检"];
    pair [label="设备配对/连接"];
    calibrate [label="传感器校准"];
    test [label="执行测试"];
    record [label="记录结果"];
    
    // Success
    node [fillcolor="#d5e8d4", color="#82b366"];
    ready [label="系统就绪\n提示用户"];
    result [label="显示最终结果"];
    
    // Retry
    node [fillcolor="#f5f5f5", color="#999999"];
    adj [label="提示调整\n重新校准"];
    
    // Decisions
    node [shape=diamond, style=filled, fillcolor="#f8cecc", color="#b85450", fontsize=10];
    d_conn [label="连接\n成功？"];
    d_cal [label="校准\n通过？"];
    d_more [label="继续\n测试？"];
    d_retry [label="重新\n开始？"];
    
    // Flow
    start -> init -> pair -> d_conn;
    d_conn -> calibrate [label="是", color="#82b366", fontcolor="#82b366"];
    d_conn -> pair [label="否", color="#b85450", fontcolor="#b85450", style=dashed];
    calibrate -> d_cal;
    d_cal -> ready [label="是", color="#82b366", fontcolor="#82b366"];
    d_cal -> adj [label="否", color="#b85450", fontcolor="#b85450"];
    adj -> calibrate [style=dashed, color="#999999"];
    ready -> test -> record -> d_more;
    d_more -> test [label="是", color="#82b366", fontcolor="#82b366", style=dashed];
    d_more -> result [label="否", color="#82b366", fontcolor="#82b366"];
    result -> d_retry;
    d_retry -> init [label="是", color="#b85450", fontcolor="#b85450", style=dashed];
    d_retry -> end_ [label="否", color="#82b366", fontcolor="#82b366"];
}
```

### Monitoring/Alert Flow (e.g., fire detection, environmental monitoring)

```dot
digraph flow {
    rankdir=TB;
    graph [fontname="Noto Sans CJK SC", bgcolor="white", dpi=200, pad="0.3"];
    node [fontname="Noto Sans CJK SC", fontsize=11];
    edge [fontname="Noto Sans CJK SC", fontsize=10];
    
    label="项目名称 — 监测流程图";
    labelloc=t; fontsize=18; fontcolor="#1a1a2e";
    
    node [shape=ellipse, style=filled, fillcolor="#dae8fc", color="#6c8ebf"];
    start [label="开始"]; end_ [label="结束"];
    
    node [shape=box, style="rounded,filled", fillcolor="#fff2cc", color="#d6b656"];
    init [label="系统初始化"];
    read [label="传感器采集数据"];
    process [label="数据处理与分析"];
    upload [label="上传云端/本地存储"];
    
    node [fillcolor="#f8cecc", color="#b85450"];
    alarm [label="触发报警\n启动执行机构"];
    
    node [fillcolor="#d5e8d4", color="#82b366"];
    normal [label="状态正常\n继续监测"];
    
    node [shape=diamond, style=filled, fillcolor="#f8cecc", color="#b85450", fontsize=10];
    d_thresh [label="超过\n阈值？"];
    d_stop [label="停止\n监测？"];
    
    start -> init -> read -> process -> d_thresh;
    d_thresh -> alarm [label="是", color="#b85450", fontcolor="#b85450"];
    d_thresh -> normal [label="否", color="#82b366", fontcolor="#82b366"];
    alarm -> upload;
    normal -> upload;
    upload -> d_stop;
    d_stop -> read [label="否", color="#82b366", fontcolor="#82b366", style=dashed];
    d_stop -> end_ [label="是", color="#999999", fontcolor="#999999"];
}
```

---

## Grade Level Adaptations

### Elementary School
- **Architecture**: Simple, 3-5 nodes maximum, large text, no subgraph clusters
- **Flow chart**: Linear flow with 1-2 decision points maximum
- **Labels**: Use simple Chinese, avoid technical jargon
- **Skip legend**: Not needed for simple diagrams

### Middle School
- **Architecture**: 6-10 nodes, 1-2 subgraph clusters, show communication protocols
- **Flow chart**: 5-8 steps with 2-3 decision branches
- **Labels**: Include component models, brief function descriptions
- **Include legend**: For diagrams with 3+ color categories

### High School
- **Architecture**: 10+ nodes, multiple subgraph clusters, detailed protocol labels
- **Flow chart**: Complete workflow with error handling, retry loops, multiple branches
- **Labels**: Full technical details including protocols, data formats, algorithms
- **Include legend**: Always include legend with all categories used

---

## Rendering Commands

```bash
# Generate PNG at 200 dpi (suitable for both screen and print)
dot -Tpng -Gdpi=200 arch.dot -o arch_diagram.png
dot -Tpng -Gdpi=200 flow.dot -o flow_diagram.png

# Optional: Generate SVG for scalable output
dot -Tsvg arch.dot -o arch_diagram.svg
dot -Tsvg flow.dot -o flow_diagram.svg
```

### Troubleshooting

**Chinese characters show as boxes:**
- Ensure `fontname="Noto Sans CJK SC"` is set on graph, node, AND edge
- Verify font exists: `fc-list :lang=zh | grep -i noto`

**Colors show warnings:**
- Use full 6-digit hex codes: `#333333` not `#333`
- Named colors like `red`, `blue`, `green` also work

**Diagram too wide/tall:**
- Add `ranksep=0.5` or `nodesep=0.3` to graph attributes
- Use `constraint=false` on cross-cluster edges to reduce layout distortion
- Split into two diagrams if necessary

**Text overflow in nodes:**
- Use `\n` for line breaks in labels
- Limit labels to 3 lines, ~15 Chinese characters per line
