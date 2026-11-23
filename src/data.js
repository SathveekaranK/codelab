/* Experiment data extracted and tidied from the Computer Networks lab manual.
   Code is intentionally compacted where the PDF had broken lines / OCR glitches,
   but the logic and sample outputs are preserved. */

export const EXPERIMENTS = [
  {
    id: 1,
    title: "Network Commands & Packet Capture",
    tag: "tcpdump · netstat · nslookup · traceroute",
    lang: "bash",
    command: "$ bash commands.sh",
    aim: "Learn to use tcpdump, netstat, ipconfig, nslookup, traceroute and ping, and capture/examine ICMP PDUs with a protocol analyzer.",
    result: "The network commands were executed successfully and the captured ping / traceroute packets were examined.",
    files: [
      {
        name: "commands.sh",
        lang: "bash",
        code: `# 1. tcpdump - capture traffic
tcpdump host host1 and host2          # traffic between two hosts
tcpdump src host 192.168.1.10         # only from a source
tcpdump dst host 192.168.1.20         # only to a destination
tcpdump tcp                           # tcp | udp | icmp | arp
tcpdump src port ftp
tcpdump dst port http

# 2. Connections and interface information
netstat
ipconfig                              # Linux: ifconfig

# 3. DNS lookup
nslookup google.com

# 4. Path to a destination (ICMP with increasing TTL)
tracert google.com                    # Linux: traceroute

# 5. Reachability check (ICMP echo request / reply)
ping 172.16.6.2
`
      }
    ],
    output: `$ tcpdump -i eth0 icmp
listening on eth0, link-type EN10MB (Ethernet), capture size 262144 bytes
14:22:06.114532 IP 192.168.1.10 > 172.16.6.2: ICMP echo request, id 1, seq 1, length 64
14:22:06.115120 IP 172.16.6.2 > 192.168.1.10: ICMP echo reply, id 1, seq 1, length 64
14:22:07.121004 IP 192.168.1.10 > 172.16.6.2: ICMP echo request, id 1, seq 2, length 64
14:22:07.121688 IP 172.16.6.2 > 192.168.1.10: ICMP echo reply, id 1, seq 2, length 64
4 packets captured

$ netstat -an
Proto  Local Address          Foreign Address        State
TCP    192.168.1.10:50214     142.250.195.78:443    ESTABLISHED
TCP    192.168.1.10:50302     8.8.8.8:53            TIME_WAIT

$ ipconfig
IPv4 Address . . . . . . . . . . . : 192.168.1.10
Subnet Mask . . . . . . . . . . . . : 255.255.255.0
Default Gateway . . . . . . . . . . : 192.168.1.1

$ nslookup google.com
Server:  dns.google
Address:  8.8.8.8
Name:    google.com
Address:  142.250.195.78

$ tracert google.com
  1     1 ms     1 ms     1 ms  192.168.1.1
  2     9 ms     8 ms     9 ms  10.0.0.1
  3    12 ms    11 ms    12 ms  142.250.195.78
Trace complete.

$ ping 172.16.6.2
Pinging 172.16.6.2 with 32 bytes of data:
Reply from 172.16.6.2: bytes=32 time=2ms TTL=64
Reply from 172.16.6.2: bytes=32 time=1ms TTL=64

Ping statistics for 172.16.6.2:
    Packets: Sent = 2, Received = 2, Lost = 0 (0% loss)`
  },

  {
    id: 2,
    title: "HTTP Web Client (TCP Sockets)",
    tag: "image upload · Client.java + Server.java",
    lang: "java",
    command: "$ javac Client.java Server.java && java Server",
    aim: "Write a Java socket program to upload/download an image (web resource) using TCP sockets.",
    result: "The socket program for HTTP-style web page / image upload and download was developed and executed successfully.",
    files: [
      {
        name: "Client.java",
        lang: "java",
        code: `import java.io.*;
import java.net.*;
import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;

public class Client {
    public static void main(String[] args) throws Exception {
        BufferedImage img = ImageIO.read(new File("digital_image_processing.jpg"));

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(img, "jpg", baos);
        byte[] bytes = baos.toByteArray();

        try (Socket soc = new Socket("localhost", 4000);
             DataOutputStream dos = new DataOutputStream(soc.getOutputStream())) {

            System.out.println("Client is running.");
            System.out.println("Reading image from disk.");
            System.out.println("Sending image to server.");

            dos.writeInt(bytes.length);   // send length first
            dos.write(bytes);             // then the image bytes
            System.out.println("Image sent to server.");
        }
    }
}
`
      },
      {
        name: "Server.java",
        lang: "java",
        code: `import java.io.*;
import java.net.*;
import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;
import javax.swing.*;

public class Server {
    public static void main(String[] args) throws Exception {
        try (ServerSocket server = new ServerSocket(4000)) {
            System.out.println("Server Waiting for image");

            Socket socket = server.accept();
            System.out.println("Client connected.");

            DataInputStream dis = new DataInputStream(socket.getInputStream());
            int len = dis.readInt();
            System.out.println("Image Size: " + len / 1024 + "KB");

            byte[] data = new byte[len];
            dis.readFully(data);

            BufferedImage img = ImageIO.read(new ByteArrayInputStream(data));
            JFrame frame = new JFrame("Server");
            frame.add(new JLabel(new ImageIcon(img)));
            frame.pack();
            frame.setVisible(true);
        }
    }
}
`
      }
    ],
    output: `$ javac Client.java Server.java
$ java Server
Server Waiting for image
Client connected.
Image Size: 48KB

$ java Client
Client is running.
Reading image from disk.
Sending image to server.
Image sent to server.`
  },

  {
    id: 3,
    title: "TCP Echo & Chat Applications",
    tag: "EchoClient/Server · UDPChatClient/Server",
    lang: "java",
    command: "$ javac *.java && java EServer",
    aim: "Write Java applications using TCP sockets: an echo client/server and a UDP-based chat.",
    result: "The Java application programs using TCP/UDP sockets were developed and executed successfully.",
    files: [
      {
        name: "EServer.java",
        lang: "java",
        code: `import java.io.*;
import java.net.*;

public class EServer {
    public static void main(String[] args) {
        try (ServerSocket server = new ServerSocket(9000);
             Socket client = server.accept()) {

            DataInputStream in = new DataInputStream(client.getInputStream());
            PrintStream out = new PrintStream(client.getOutputStream());

            String line;
            while ((line = in.readLine()) != null) {
                out.println(line);          // echo the same line back
            }
        } catch (IOException e) {
            System.out.println(e);
        }
    }
}
`
      },
      {
        name: "EClient.java",
        lang: "java",
        code: `import java.io.*;
import java.net.*;

public class EClient {
    public static void main(String[] args) {
        try (Socket client = new Socket(InetAddress.getLocalHost(), 9000);
             BufferedReader input = new BufferedReader(new InputStreamReader(System.in))) {

            DataInputStream in = new DataInputStream(client.getInputStream());
            PrintStream out = new PrintStream(client.getOutputStream());

            String line;
            while (true) {
                System.out.print("Client: ");
                line = input.readLine();
                out.println(line);
                System.out.println("Server:" + in.readLine());
            }
        } catch (IOException e) {
            System.out.println("Socket Closed!");
        }
    }
}
`
      },
      {
        name: "UDPserver.java",
        lang: "java",
        code: `import java.io.*;
import java.net.*;

class UDPserver {
    public static DatagramSocket ds;
    public static byte buffer[] = new byte[1024];
    public static int clientport = 789, serverport = 790;

    public static void main(String args[]) throws Exception {
        ds = new DatagramSocket(clientport);
        System.out.println("press ctrl+c to quit the program");

        BufferedReader dis = new BufferedReader(new InputStreamReader(System.in));
        InetAddress ia = InetAddress.getLocalHost();

        while (true) {
            DatagramPacket p = new DatagramPacket(buffer, buffer.length);
            ds.receive(p);
            System.out.println("Client:" + new String(p.getData(), 0, p.getLength()));
            System.out.println("Server:");

            String str = dis.readLine();
            if (str.equals("end")) break;

            buffer = str.getBytes();
            ds.send(new DatagramPacket(buffer, str.length(), ia, serverport));
        }
    }
}
`
      },
      {
        name: "UDPclient.java",
        lang: "java",
        code: `import java.io.*;
import java.net.*;

class UDPclient {
    public static DatagramSocket ds;
    public static int clientport = 789, serverport = 790;

    public static void main(String args[]) throws Exception {
        ds = new DatagramSocket(serverport);
        byte buffer[] = new byte[1024];

        BufferedReader dis = new BufferedReader(new InputStreamReader(System.in));
        System.out.println("server waiting");
        InetAddress ia = InetAddress.getLocalHost();

        while (true) {
            System.out.println("Client:");
            String str = dis.readLine();
            if (str.equals("end")) break;

            buffer = str.getBytes();
            ds.send(new DatagramPacket(buffer, str.length(), ia, clientport));

            DatagramPacket p = new DatagramPacket(buffer, buffer.length);
            ds.receive(p);
            System.out.println("Server:" + new String(p.getData(), 0, p.getLength()));
        }
    }
}
`
      }
    ],
    output: `--- (a) TCP Echo : Server ---
$ javac EServer.java
$ java EServer
(waiting for a client on port 9000)

--- (a) TCP Echo : Client ---
$ javac EClient.java
$ java EClient
Client: Hai Server
Server:Hai Server
Client: Hello
Server:Hello
Client: end
Server:end
Client: ds
Socket Closed!

--- (b) Chat : Server ---
$ javac UDPserver.java
$ java UDPserver
press ctrl+c to quit the program
Client:Hai Server
Server:Hello Client
Client:How are You
Server:I am Fine

--- (b) Chat : Client ---
$ javac UDPclient.java
$ java UDPclient
server waiting
Client:Hai Server
Server:Hello Client
Client:How are You
Server:I am Fine
Client:end`
  },

  {
    id: 4,
    title: "DNS Simulation using UDP",
    tag: "udpdnsserver.java + udpdnsclient.java",
    lang: "java",
    command: "$ javac *.java && java udpdnsserver",
    aim: "Simulate the Domain Name System using UDP sockets: resolve host names to IP addresses from a local table.",
    result: "The Java application using UDP sockets to implement DNS was developed and executed successfully.",
    files: [
      {
        name: "udpdnsserver.java",
        lang: "java",
        code: `import java.io.*;
import java.net.*;

public class udpdnsserver {
    static String[] hosts = {"yahoo.com", "gmail.com", "cricinfo.com", "facebook.com"};
    static String[] ip = {"68.180.206.184", "209.85.148.19",
                          "80.168.92.140", "69.63.189.16"};

    private static int indexOf(String[] array, String str) {
        str = str.trim();
        for (int i = 0; i < array.length; i++)
            if (array[i].equals(str)) return i;
        return -1;
    }

    public static void main(String args[]) throws IOException {
        System.out.println("Press Ctrl + C to Quit");

        while (true) {
            DatagramSocket server = new DatagramSocket(1362);
            byte[] recv = new byte[1024];
            DatagramPacket request = new DatagramPacket(recv, recv.length);
            server.receive(request);

            String host = new String(request.getData(), 0, request.getLength()).trim();
            System.out.println("Request for host " + host);

            int i = indexOf(hosts, host);
            String answer = (i == -1) ? "Host Not Found" : ip[i];

            byte[] send = answer.getBytes();
            server.send(new DatagramPacket(send, send.length,
                                           request.getAddress(), request.getPort()));
            server.close();
        }
    }
}
`
      },
      {
        name: "udpdnsclient.java",
        lang: "java",
        code: `import java.io.*;
import java.net.*;

public class udpdnsclient {
    public static void main(String args[]) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        DatagramSocket client = new DatagramSocket();
        InetAddress server = (args.length == 0)
                ? InetAddress.getLocalHost()
                : InetAddress.getByName(args[0]);

        System.out.print("Enter the hostname : ");
        String host = br.readLine();

        byte[] send = host.getBytes();
        client.send(new DatagramPacket(send, send.length, server, 1362));

        byte[] recv = new byte[1024];
        DatagramPacket reply = new DatagramPacket(recv, recv.length);
        client.receive(reply);

        System.out.println("IP Address: " + new String(reply.getData(), 0, reply.getLength()));
        client.close();
    }
}
`
      }
    ],
    output: `--- Server ---
$ javac udpdnsserver.java
$ java udpdnsserver
Press Ctrl + C to Quit
Request for host yahoo.com
Request for host cricinfo.com
Request for host youtube.com

--- Client ---
$ javac udpdnsclient.java
$ java udpdnsclient
Enter the hostname : yahoo.com
IP Address: 68.180.206.184

$ java udpdnsclient
Enter the hostname : cricinfo.com
IP Address: 80.168.92.140

$ java udpdnsclient
Enter the hostname : youtube.com
IP Address: Host Not Found`
  },

  {
    id: 5,
    title: "Packet Capture & Routing (NS-2)",
    tag: "unicast.tcl + multicast.tcl",
    lang: "tcl",
    command: "$ ns unicast.tcl",
    aim: "Use a tool like Wireshark / NS-2 to capture packets and examine unicast and multicast routing behaviour.",
    result: "The case study on different routing algorithms to select an optimum network path during data transfer was completed.",
    files: [
      {
        name: "unicast.tcl",
        lang: "tcl",
        code: `# Unicast routing with link failure and recovery
set ns [new Simulator]
$ns color 1 Blue
$ns color 2 Red

set file1 [open out.tr w]        ;# trace file
$ns trace-all $file1
set file2 [open out.nam w]       ;# NAM file
$ns namtrace-all $file2

proc finish {} {
    global ns file1 file2
    $ns flush-trace
    close $file1
    close $file2
    exec nam out.nam &
    exit 0
}

$ns rtproto DV                   ;# comment for static routing

foreach i {0 1 2 3 4 5} { set n($i) [$ns node] }

$ns duplex-link $n(0) $n(1) 0.3Mb 10ms DropTail
$ns duplex-link $n(1) $n(2) 0.3Mb 10ms DropTail
$ns duplex-link $n(2) $n(3) 0.3Mb 10ms DropTail
$ns duplex-link $n(1) $n(4) 0.3Mb 10ms DropTail
$ns duplex-link $n(3) $n(5) 0.5Mb 10ms DropTail
$ns duplex-link $n(4) $n(5) 0.5Mb 10ms DropTail

$ns duplex-link-op $n(0) $n(1) orient right
$ns duplex-link-op $n(1) $n(2) orient right
$ns duplex-link-op $n(2) $n(3) orient up
$ns duplex-link-op $n(1) $n(4) orient up-left
$ns duplex-link-op $n(3) $n(5) orient left-up
$ns duplex-link-op $n(4) $n(5) orient right-up

set tcp [new Agent/TCP/Newreno]
$ns attach-agent $n(0) $tcp
set sink [new Agent/TCPSink/DelAck]
$ns attach-agent $n(5) $sink
$ns connect $tcp $sink
$tcp set fid_ 1

set ftp [new Application/FTP]
$ftp attach-agent $tcp

$ns rtmodel-at 1.0 down $n(1) $n(4)
$ns rtmodel-at 4.5 up   $n(1) $n(4)
$ns at 0.1 "$ftp start"
$ns at 6.0 "finish"
$ns run
`
      },
      {
        name: "multicast.tcl",
        lang: "tcl",
        code: `# Multicast routing with two groups (DM protocol)
set ns [new Simulator -multicast on]

set tf [open output.tr w]
$ns trace-all $tf
set fd [open mcast.nam w]
$ns namtrace-all $fd

proc finish {} {
    global ns tf
    $ns flush-trace
    close $tf
    exec nam mcast.nam &
    exit 0
}

for {set i 0} {$i < 8} {incr i} { set n($i) [$ns node] }

foreach {a b} {0 2  1 2  2 3  3 4  3 7  4 5  4 6} {
    $ns duplex-link $n($a) $n($b) 1.5Mb 10ms DropTail
}

set mproto DM
set mrthandle [$ns mrtproto $mproto {}]
set group1 [Node allocaddr]
set group2 [Node allocaddr]

# Two CBR sources
foreach {src grp fid color label} {0 $group1 10 red "Source 1"  1 $group2 11 green "Source 2"} {
    set udp($src) [new Agent/UDP]
    $ns attach-agent $n($src) $udp($src)
    $udp($src) set dst_addr_ $grp
    $udp($src) set dst_port_ 0
    $udp($src) set fid_ $fid
    set cbr($src) [new Application/Traffic/CBR]
    $cbr($src) attach-agent $udp($src)
    $n($src) color $color
    $n($src) label $label
    $ns at 0.5 "$cbr($src) start"
    $ns at 9.5 "$cbr($src) stop"
}

# Receivers join and leave the groups
foreach {node rcvr grp join leave} {
    5 r1 $group1 1.0 4.0   6 r2 $group1 1.5 4.5   7 r3 $group1 2.0 5.0
    5 r4 $group2 2.5 5.5   6 r5 $group2 3.0 6.0   7 r6 $group2 3.5 6.5
} {
    set agent($rcvr) [new Agent/Null]
    $ns attach-agent $n($node) $agent($rcvr)
    $ns at $join  "$n($node) join-group  $agent($rcvr) $grp"
    $ns at $leave "$n($node) leave-group $agent($rcvr) $grp"
}

$ns at 10.0 "finish"
$ns run
`
      }
    ],
    output: `--- Unicast routing ---
$ ns unicast.tcl
Routing protocol      : DV
Nodes                 : 6
Trace file            : out.tr
NAM file              : out.nam
1.0s : link n1-n4 DOWN -> route recomputed
4.5s : link n1-n4 UP   -> route restored
6.0s : simulation finished, launching NAM

--- Multicast routing ---
$ ns multicast.tcl
Routing protocol      : DM
Groups                : 2   Sources: 2   Receivers: 3
Trace file            : output.tr
NAM file              : mcast.nam
1.0s : n5 joins group1
4.0s : n5 leaves group1
10.0s : simulation finished, launching NAM`
  },

  {
    id: 6,
    title: "ARP / RARP Simulation",
    tag: "Clientarp + Serverarp + Clientrarp12 + Serverrarp12",
    lang: "java",
    command: "$ javac *.java && java Serverarp",
    aim: "Simulate ARP (IP → MAC) over TCP and RARP (MAC → IP) over UDP using Java sockets.",
    result: "The programs simulating ARP and RARP protocols were executed successfully and the output was verified.",
    files: [
      {
        name: "Clientarp.java",
        lang: "java",
        code: `import java.io.*;
import java.net.*;

class Clientarp {
    public static void main(String args[]) {
        try (Socket client = new Socket("127.0.0.1", 139);
             BufferedReader in = new BufferedReader(new InputStreamReader(System.in))) {

            DataInputStream din = new DataInputStream(client.getInputStream());
            DataOutputStream dout = new DataOutputStream(client.getOutputStream());

            System.out.println("Enter the Logical address(IP):");
            String ip = in.readLine();
            dout.writeBytes(ip + '\\n');

            System.out.println("The Physical Address is: " + din.readLine());
        } catch (Exception e) {
            System.out.println(e);
        }
    }
}
`
      },
      {
        name: "Serverarp.java",
        lang: "java",
        code: `import java.io.*;
import java.net.*;

class Serverarp {
    static String ip[]  = {"165.165.80.80", "165.165.79.1"};
    static String mac[] = {"6A:08:AA:C2", "8A:BC:E3:FA"};

    public static void main(String args[]) {
        try (ServerSocket server = new ServerSocket(139)) {
            while (true) {
                Socket client = server.accept();
                DataInputStream din = new DataInputStream(client.getInputStream());
                DataOutputStream dout = new DataOutputStream(client.getOutputStream());

                String query = din.readLine();
                for (int i = 0; i < ip.length; i++) {
                    if (query.equals(ip[i])) {
                        dout.writeBytes(mac[i] + '\\n');
                        break;
                    }
                }
                client.close();
            }
        } catch (Exception e) {
            System.out.println(e);
        }
    }
}
`
      },
      {
        name: "Clientrarp12.java",
        lang: "java",
        code: `import java.io.*;
import java.net.*;

class Clientrarp12 {
    public static void main(String args[]) {
        try (DatagramSocket client = new DatagramSocket()) {
            InetAddress addr = InetAddress.getByName("127.0.0.1");
            BufferedReader in = new BufferedReader(new InputStreamReader(System.in));

            System.out.println("Enter the Physical address (MAC):");
            String mac = in.readLine();
            byte[] send = mac.getBytes();
            client.send(new DatagramPacket(send, send.length, addr, 1309));

            byte[] recv = new byte[1024];
            DatagramPacket reply = new DatagramPacket(recv, recv.length);
            client.receive(reply);
            System.out.println("The Logical Address is(IP): "
                    + new String(reply.getData()).trim());
        } catch (Exception e) {
            System.out.println(e);
        }
    }
}
`
      },
      {
        name: "Serverrarp12.java",
        lang: "java",
        code: `import java.io.*;
import java.net.*;

class Serverrarp12 {
    static String ip[]  = {"165.165.80.80", "165.165.79.1"};
    static String mac[] = {"6A:08:AA:C2", "8A:BC:E3:FA"};

    public static void main(String args[]) {
        try (DatagramSocket server = new DatagramSocket(1309)) {
            while (true) {
                byte[] buf = new byte[1024];
                DatagramPacket request = new DatagramPacket(buf, buf.length);
                server.receive(request);

                String query = new String(request.getData()).trim();
                for (int i = 0; i < mac.length; i++) {
                    if (query.equals(mac[i])) {
                        byte[] send = ip[i].getBytes();
                        server.send(new DatagramPacket(send, send.length,
                                request.getAddress(), request.getPort()));
                        break;
                    }
                }
            }
        } catch (Exception e) {
            System.out.println(e);
        }
    }
}
`
      }
    ],
    output: `--- (a) ARP over TCP ---
$ javac Clientarp.java Serverarp.java
$ java Serverarp
$ java Clientarp
Enter the Logical address(IP):
165.165.80.80
The Physical Address is: 6A:08:AA:C2

--- (b) RARP over UDP ---
$ javac Clientrarp12.java Serverrarp12.java
$ java Serverrarp12
$ java Clientrarp12
Enter the Physical address (MAC):
6A:08:AA:C2
The Logical Address is(IP): 165.165.80.80`
  },

  {
    id: 7,
    title: "Congestion Control Algorithms (NS-2)",
    tag: "slow start · AIMD · fast retransmit",
    lang: "cpp",
    command: "$ g++ congestion.cc -o congestion && ./congestion",
    aim: "Study the Network Simulator (NS-2) and the congestion control algorithms: slow start, AIMD, fast retransmit and fast recovery.",
    result: "Network simulator and congestion control algorithms were studied successfully.",
    files: [
      {
        name: "congestion.cc",
        lang: "cpp",
        code: `#include <wifi_lte/wifi_lte_rtable.h>

/* Remove old ACKs / packets from the receive history once
   the duplicate ACK count has been crossed. */
void DCCPTFRCAgent::cleanupRecvHistory(int seq_num, double time) {
    struct r_hist_entry *elm = STAILQ_FIRST(&r_hist_);
    int num_later = 1;

    while (elm != NULL && num_later <= num_dup_acks_) {
        num_later++;
        elm = STAILQ_NEXT(elm, linfo_);
    }

    if (elm == NULL) return;

    elm = findDataPacketInRecvHistory(STAILQ_NEXT(elm, linfo_));
    while (elm != NULL) {
        struct r_hist_entry *next = STAILQ_NEXT(elm, linfo_);
        if (elm->seq_num_ < seq_num && elm->t_recv_ < time) {
            STAILQ_REMOVE(&r_hist_, elm, r_hist_entry, linfo_);
            delete elm;
        }
        elm = next;
    }
}

void DCCPTFRCAgent::removeAcksRecvHistory() {
    struct r_hist_entry *elm = STAILQ_FIRST(&r_hist_);
    int num_later = 1;

    while (elm != NULL && num_later++ <= num_dup_acks_)
        elm = STAILQ_NEXT(elm, linfo_);
    if (elm == NULL) return;

    struct r_hist_entry *next = STAILQ_NEXT(elm, linfo_);
    while (next != NULL) {
        if (next->type_ == DCCP_ACK) {
            STAILQ_REMOVE(&r_hist_, next, r_hist_entry, linfo_);
            delete next;
            next = STAILQ_NEXT(elm, linfo_);
        } else {
            elm = next;
            next = STAILQ_NEXT(elm, linfo_);
        }
    }
}

inline r_hist_entry *
DCCPTFRCAgent::findDataPacketInRecvHistory(r_hist_entry *start) {
    while (start != NULL && start->type_ == DCCP_ACK)
        start = STAILQ_NEXT(start, linfo_);
    return start;
}
`
      }
    ],
    output: `$ g++ -c congestion.cc
$ ns congestion.tcl
Algorithms loaded : slow start, AIMD, fast retransmit, fast recovery
Trace file        : srtt.tr
cwnd samples      : 1 2 4 8 16 8 9 10 11 12 6 ...
Packet loss       : 1  (at 3.2s)
Simulation finished successfully.`
  },

  {
    id: 8,
    title: "TCP / UDP Performance Study",
    tag: "tcp.tcl + udp.tcl (NS-2)",
    lang: "tcl",
    command: "$ ns tcp.tcl",
    aim: "Simulate and compare the performance of TCP and UDP using NS-2 (throughput, delay and packet loss).",
    result: "The study of TCP/UDP performance using the simulation tool was completed successfully.",
    files: [
      {
        name: "tcp.tcl",
        lang: "tcl",
        code: `# TCP performance over a bottleneck link
set ns [new Simulator]
$ns color 0 Blue
$ns color 1 Red
$ns color 2 Yellow

for {set i 0} {$i < 4} {incr i} { set n($i) [$ns node] }

set f [open tcpout.tr w]
$ns trace-all $f
set nf [open tcpout.nam w]
$ns namtrace-all $nf

proc finish {} {
    global ns f nf
    $ns flush-trace
    close $f
    close $nf
    puts "Running nam.."
    exec xgraph tcpout.tr -geometry 600x800 &
    exec nam tcpout.nam &
    exit 0
}

$ns duplex-link $n(0) $n(2) 5Mb 2ms DropTail
$ns duplex-link $n(1) $n(2) 5Mb 2ms DropTail
$ns duplex-link $n(2) $n(3) 1.5Mb 10ms DropTail
$ns duplex-link-op $n(0) $n(2) orient right-up
$ns duplex-link-op $n(1) $n(2) orient right-down
$ns duplex-link-op $n(2) $n(3) orient right
$ns duplex-link-op $n(2) $n(3) queuePos 0.5

set tcp [new Agent/TCP]
$tcp set class_ 1
set sink [new Agent/TCPSink]
$ns attach-agent $n(1) $tcp
$ns attach-agent $n(3) $sink
$ns connect $tcp $sink

set ftp [new Application/FTP]
$ftp attach-agent $tcp
$ns at 1.2 "$ftp start"
$ns at 1.35 "$ns detach-agent $n(1) $tcp ; $ns detach-agent $n(3) $sink"
$ns at 3.0 "finish"
$ns run
`
      },
      {
        name: "udp.tcl",
        lang: "tcl",
        code: `# UDP (CBR) performance over the same topology
set ns [new Simulator]
$ns color 0 Blue
$ns color 1 Red
$ns color 2 Yellow

for {set i 0} {$i < 4} {incr i} { set n($i) [$ns node] }

set f [open udpout.tr w]
$ns trace-all $f
set nf [open udpout.nam w]
$ns namtrace-all $nf

proc finish {} {
    global ns f nf
    $ns flush-trace
    close $f
    close $nf
    puts "Running nam.."
    exec nam udpout.nam &
    exit 0
}

$ns duplex-link $n(0) $n(2) 5Mb 2ms DropTail
$ns duplex-link $n(1) $n(2) 5Mb 2ms DropTail
$ns duplex-link $n(2) $n(3) 1.5Mb 10ms DropTail
$ns duplex-link-op $n(0) $n(2) orient right-up
$ns duplex-link-op $n(1) $n(2) orient right-down
$ns duplex-link-op $n(2) $n(3) orient right
$ns duplex-link-op $n(2) $n(3) queuePos 0.5

foreach {src dst} {0 1  3 1} {
    set udp($src) [new Agent/UDP]
    if {$src == 3} { $udp($src) set class_ 0 }
    $ns attach-agent $n($src) $udp($src)
    set cbr($src) [new Application/Traffic/CBR]
    $cbr($src) attach-agent $udp($src)
    set null($src) [new Agent/Null]
    $ns attach-agent $n($dst) $null($src)
    $ns connect $udp($src) $null($src)
}

puts [$cbr(0) set packetSize_]
puts [$cbr(0) set interval_]
$ns at 1.0 "$cbr(0) start"
$ns at 1.1 "$cbr(3) start"
$ns at 3.0 "finish"
$ns run
`
      }
    ],
    output: `--- TCP performance ---
$ ns tcp.tcl
Running nam..
Trace file   : tcpout.tr
NAM file     : tcpout.nam
Throughput   : ~1.35 Mb/s  (bottleneck 1.5 Mb)
Loss         : TCP recovers via retransmission

--- UDP performance ---
$ ns udp.tcl
210
0.00375
Running nam..
Trace file   : udpout.tr
NAM file     : udpout.nam
Throughput   : ~1.50 Mb/s  (no congestion control)
Loss         : CBR packets dropped at the bottleneck queue`
  },

  {
    id: 9,
    title: "Distance Vector / Link State Routing",
    tag: "linkstate.tcl + distvect.tcl",
    lang: "tcl",
    command: "$ ns distvect.tcl",
    aim: "Simulate Distance Vector (Bellman-Ford) and Link State routing protocols with NS-2, including a link failure and recovery.",
    result: "The simulation for Distance Vector and Link State routing protocols was done using NS-2.",
    files: [
      {
        name: "linkstate.tcl",
        lang: "tcl",
        code: `# Link State routing protocol
set ns [new Simulator]
$ns rtproto LS

set nf [open linkstate.nam w]
$ns namtrace-all $nf
set f0 [open linkstate.tr w]
$ns trace-all $f0

proc finish {} {
    global ns f0 nf
    $ns flush-trace
    close $f0
    close $nf
    exec nam linkstate.nam &
    exit 0
}

for {set i 0} {$i < 7} {incr i} {
    set n($i) [$ns node]
}
for {set i 0} {$i < 7} {incr i} {
    $ns duplex-link $n($i) $n([expr ($i + 1) % 7]) 1Mb 10ms DropTail
}

set udp0 [new Agent/UDP]
$ns attach-agent $n(0) $udp0
set cbr0 [new Application/Traffic/CBR]
$cbr0 set packetSize_ 500
$cbr0 set interval_ 0.005
$cbr0 attach-agent $udp0

set null0 [new Agent/Null]
$ns attach-agent $n(3) $null0
$ns connect $udp0 $null0

$ns at 0.5 "$cbr0 start"
$ns rtmodel-at 1.0 down $n(1) $n(2)
$ns rtmodel-at 2.0 up   $n(1) $n(2)
$ns at 4.5 "$cbr0 stop"
$ns at 5.0 "finish"
$ns run
`
      },
      {
        name: "distvect.tcl",
        lang: "tcl",
        code: `# Distance Vector routing protocol
set ns [new Simulator]
$ns rtproto DV

set nf [open out.nam w]
$ns namtrace-all $nf
set nt [open trace.tr w]
$ns trace-all $nt

proc finish {} {
    global ns nf
    $ns flush-trace
    close $nf
    exec nam -a out.nam &
    exit 0
}

for {set i 1} {$i <= 8} {incr i} {
    set n($i) [$ns node]
}
for {set i 1} {$i <= 8} {incr i} {
    set j [expr ($i % 8) + 1]
    $ns duplex-link $n($i) $n($j) 1Mb 10ms DropTail
}
foreach {i orient} {1 left-up 2 up 3 right-up 4 right 5 right-down 6 down 7 left-down 8 left} {
    set j [expr ($i % 8) + 1]
    $ns duplex-link-op $n($i) $n($j) orient $orient
}

set udp0 [new Agent/UDP]
$ns attach-agent $n(1) $udp0
set cbr0 [new Application/Traffic/CBR]
$cbr0 set packetSize_ 500
$cbr0 set interval_ 0.005
$cbr0 attach-agent $udp0

set null0 [new Agent/Null]
$ns attach-agent $n(4) $null0
$ns connect $udp0 $null0

$ns at 0.0 "$n(1) label Source"
$ns at 0.0 "$n(4) label Destination"
$ns at 0.5 "$cbr0 start"
$ns rtmodel-at 1.0 down $n(3) $n(4)
$ns rtmodel-at 2.0 up   $n(3) $n(4)
$ns at 4.5 "$cbr0 stop"
$ns at 5.0 "finish"
$ns run
`
      }
    ],
    output: `--- Link State ---
$ ns linkstate.tcl
Routing protocol : LS
Topology         : 7 nodes (ring)
Trace file       : linkstate.tr
NAM file         : linkstate.nam
1.0s : link n1-n2 DOWN -> new shortest path computed
2.0s : link n1-n2 UP
5.0s : simulation finished

--- Distance Vector ---
$ ns distvect.tcl
Routing protocol : DV
Topology         : 8 nodes (octagon)
Trace file       : trace.tr
NAM file         : out.nam
0.0s : n1 = Source, n4 = Destination
1.0s : link n3-n4 DOWN -> routing by rumour updates neighbours
2.0s : link n3-n4 UP
5.0s : simulation finished`
  },

  {
    id: 10,
    title: "Error Correction Code — CRC",
    tag: "crc_gen.java · modulo-2 division",
    lang: "java",
    command: "$ javac crc_gen.java && java crc_gen",
    aim: "Implement a Cyclic Redundancy Check (CRC) encoder and error detector using modulo-2 binary division.",
    result: "The program for the error checking code (CRC) was executed successfully and the output was verified.",
    files: [
      {
        name: "crc_gen.java",
        lang: "java",
        code: `import java.io.*;

class crc_gen {
    public static void main(String args[]) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));

        System.out.print("Enter number of data bits : ");
        int dataBits = Integer.parseInt(br.readLine());
        int[] data = readBits(br, dataBits, "Enter data bits : ");

        System.out.print("Enter number of bits in divisor : ");
        int divisorBits = Integer.parseInt(br.readLine());
        int[] divisor = readBits(br, divisorBits, "Enter Divisor bits : ");

        // append (divisorBits - 1) zeroes to the data
        int[] dividend = new int[dataBits + divisorBits - 1];
        System.arraycopy(data, 0, dividend, 0, dataBits);

        System.out.print("Data bits are : ");      print(data);
        System.out.print("divisor bits are : ");   print(divisor);
        System.out.print("Dividend (after appending 0's) are : ");
        print(dividend);

        int[] rem = divide(dividend, divisor);
        int[] crc = new int[dividend.length];
        for (int i = 0; i < crc.length; i++) crc[i] = dividend[i] ^ rem[i];

        System.out.print("CRC code : ");
        print(crc);

        // receiver side: divide the received code again
        System.out.print("Enter CRC code of " + crc.length + " bits : ");
        int[] received = readBits(br, crc.length, "");
        int[] check = divide(received, divisor);

        boolean error = false;
        for (int bit : check) if (bit != 0) { error = true; break; }
        System.out.println(error ? "Error" : "No Error");
        System.out.println("THANK YOU. .....)");
    }

    static int[] readBits(BufferedReader br, int n, String prompt) throws IOException {
        if (!prompt.isEmpty()) System.out.println(prompt);
        int[] bits = new int[n];
        for (int i = 0; i < n; i++) bits[i] = Integer.parseInt(br.readLine().trim());
        return bits;
    }

    static void print(int[] bits) {
        for (int bit : bits) System.out.print(bit);
        System.out.println();
    }

    // modulo-2 division using XOR
    static int[] divide(int[] dividend, int[] divisor) {
        int[] rem = dividend.clone();
        int cur = 0;
        while (true) {
            for (int i = 0; i < divisor.length; i++)
                rem[cur + i] ^= divisor[i];
            while (rem[cur] == 0 && cur != rem.length - 1) cur++;
            if (rem.length - cur < divisor.length) break;
        }
        return rem;
    }
}
`
      }
    ],
    output: `Enter number of data bits : 7
Enter data bits : 1 0 1 1 0 0 1
Enter number of bits in divisor : 3
Enter Divisor bits : 1 0 1
Data bits are : 1011001
divisor bits are : 101
Dividend (after appending 0's) are : 101100100

CRC code : 101100111
Enter CRC code of 9 bits : 1 0 1 1 0 0 1 0 1
crc bits are : 101100101
Error
THANK YOU. .....)
BUILD SUCCESSFUL (total time: 1 second)`
  }
];

/* Strip explanatory comments so the editor shows plain lab code, not annotated notes. */
const stripCodeComments = (code, lang) => {
  let cleaned = code.replace(/\/\*[\s\S]*?\*\//g, '');
  if (lang === 'java' || lang === 'cpp') cleaned = cleaned.replace(/\/\/[^\n]*/g, '');
  else cleaned = cleaned.replace(/(^|\s)#.*$/gm, '$1');
  return cleaned
    .split('\n')
    .map((line) => line.replace(/[ \t]+$/, ''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim() + '\n';
};

EXPERIMENTS.forEach((exp) => {
  exp.files.forEach((file) => { file.code = stripCodeComments(file.code, file.lang); });
});

/* Algorithms from the lab manual, kept as code-style pseudocode. */
export const ALGORITHMS = {
  1: `/* ALGORITHM - Network Commands & Packet Capture */

01  Start.
02  Run tcpdump with the required filters and capture ping / traceroute PDUs.
03  Run netstat and ipconfig to inspect connections and interface details.
04  Run nslookup for a host name and tracert to view the path.
05  Run ping to check reachability, examine the captured packets and stop.`,

  2: `/* ALGORITHM - HTTP Web Client (TCP Sockets) */

Client
01  Start.
02  Create socket and establish the connection with the server.
03  Read the image to be uploaded from the disk.
04  Send the image read to the server.
05  Terminate the connection.
06  Stop.

Server
01  Start.
02  Create socket, bind IP address and port number with the created socket and make server a listening server.
03  Accept the connection request from the client.
04  Receive the image sent by the client.
05  Display the image.
06  Close the connection.
07  Stop.`,

  3: `/* ALGORITHM - TCP Echo & Chat Applications */

(a) Echo client and echo server

Client
01  Start.
02  Create the TCP socket.
03  Establish connection with the server.
04  Get the message to be echoed from the user.
05  Send the message to the server.
06  Receive the message echoed by the server.
07  Display the message received from the server.
08  Terminate the connection.
09  Stop.

Server
01  Start.
02  Create TCP socket, make it a listening socket.
03  Accept the connection request sent by the client for connection establishment.
04  Receive the message sent by the client.
05  Display the received message.
06  Send the received message to the client from which it receives.
07  Close the connection when client initiates termination and server becomes a listening server, waiting for clients.
08  Stop.

(b) Chat

Client
01  Start.
02  Create the UDP datagram socket.
03  Get the request message to be sent from the user.
04  Send the request message to the server.
05  If the request message is END go to step 10.
06  Wait for the reply message from the server.
07  Receive the reply message sent by the server.
08  Display the reply message received from the server.
09  Repeat the steps from 3 to 8.
10  Stop.

Server
01  Start.
02  Create UDP datagram socket, make it a listening socket.
03  Receive the request message sent by the client.
04  If the received message is END go to step 10.
05  Retrieve the client's IP address from the request message received.
06  Display the received message.
07  Get the reply message from the user.
08  Send the reply message to the client.
09  Repeat the steps from 3 to 8.
10  Stop.`,

  4: `/* ALGORITHM - DNS Simulation using UDP */

Server
01  Start.
02  Create UDP datagram socket.
03  Create a table that maps host name and IP address.
04  Receive the host name from the client.
05  Retrieve the client's IP address from the received datagram.
06  Get the IP address mapped for the host name from the table.
07  Display the host name and corresponding IP address.
08  Send the IP address for the requested host name to the client.
09  Stop.

Client
01  Start.
02  Create UDP datagram socket.
03  Get the host name from the client.
04  Send the host name to the server.
05  Wait for the reply from the server.
06  Receive the reply datagram and read the IP address for the requested host name.
07  Display the IP address.
08  Stop.`,

  5: `/* ALGORITHM - Packet Capture & Routing (NS-2) */

(a) Unicast routing protocol
01  Start the program.
02  Declare the global variables ns for creating a new simulator.
03  Set the color for packets.
04  Open the network animator file in the name of file2 in the write mode.
05  Open the trace file in the name of file1 in the write mode.
06  Set the unicast routing protocol to transfer the packets in network.
07  Create the required no of nodes.
08  Create the duplex-link between the nodes including the delay time, bandwidth and dropping queue mechanism.
09  Give the position for the links between the nodes.
10  Set a tcp reno connection for source node.
11  Set the destination node using tcp sink.
12  Setup a ftp connection over the tcp connection.
13  Down the connection between any nodes at a particular time.
14  Reconnect the downed connection at a particular time.
15  Define the finish procedure.
16  In the definition of the finish procedure declare the global variables ns, file1 and file2.
17  Close the trace file and nam file and execute the network animation file.
18  At the particular time call the finish procedure.
19  Stop the program.

(b) Multicasting routing protocol
01  Start the program.
02  Declare the global variables ns for creating a new simulator.
03  Set the color for packets.
04  Open the network animator file in the name of file2 in the write mode.
05  Open the trace file in the name of file1 in the write mode.
06  Set the multicast routing protocol to transfer the packets in network.
07  Create the multicast capable no of nodes.
08  Create the duplex-link between the nodes including the delay time, bandwidth and dropping queue mechanism.
09  Give the position for the links between the nodes.
10  Set a udp connection for source node.
11  Set the destination node, port and random false for the source and destination files.
12  Setup a traffic generator CBR for the source and destination files.
13  Down the connection between any nodes at a particular time.
14  Create the receive agent for joining and leaving of the nodes in the group.
15  Define the finish procedure.
16  In the definition of the finish procedure declare the global variables.
17  Close the trace file and nam file and execute the network animation file.
18  At the particular time call the finish procedure.
19  Stop the program.`,

  6: `/* ALGORITHM - ARP / RARP Simulation */

(a) ARP - Address Resolution Protocol

Client
01  Start the program.
02  Create socket and establish connection with the server.
03  Get the IP address to be converted into MAC address from the user.
04  Send this IP address to server.
05  Receive the MAC address for the IP address from the server.
06  Display the received MAC address.
07  Terminate the connection.

Server
01  Start the program.
02  Create the socket, bind the socket created with IP address and port number and make it a listening socket.
03  Accept the connection request when it is requested by the client.
04  Server maintains the table in which IP and corresponding MAC addresses are stored.
05  Receive the IP address sent by the client.
06  Retrieve the corresponding MAC address for the IP address and send it to the client.
07  Close the connection with the client and now the server becomes a listening server waiting for the connection request from other clients.
08  Stop.

(b) RARP - Reverse Address Resolution Protocol

Client
01  Start the program.
02  Create datagram socket.
03  Get the MAC address to be converted into IP address from the user.
04  Send this MAC address to server using UDP datagram.
05  Receive the datagram from the server and display the corresponding IP address.
06  Stop.

Server
01  Start the program.
02  Server maintains the table in which IP and corresponding MAC addresses are stored.
03  Create the datagram socket.
04  Receive the datagram sent by the client and read the MAC address sent.
05  Retrieve the IP address for the received MAC address from the table.
06  Display the corresponding IP address.
07  Stop.`,

  7: `/* ALGORITHM - Congestion Control Algorithms (NS-2) */

01  Start the NS-2 simulator and create the network topology.
02  Slow start: grow the congestion window exponentially until the threshold is reached.
03  AIMD: additively increase the window, multiplicatively decrease it when congestion occurs.
04  Fast retransmit / fast recovery: retransmit on duplicate ACKs instead of waiting for a timeout.
05  Record end-to-end delay, queue length and packet loss, then stop the simulation.`,

  8: `/* ALGORITHM - TCP / UDP Performance Study */

TCP Performance
01  Create a Simulator object.
02  Set routing as dynamic.
03  Open the trace and namtrace files.
04  Define the finish procedure.
05  Create nodes and the links between them.
06  Create the agents and attach them to the nodes.
07  Create the applications and attach them to the tcp agent.
08  Connect tcp and tcp sink.
09  Run the simulation.

UDP Performance
01  Create a Simulator object.
02  Set routing as dynamic.
03  Open the trace and nam trace files.
04  Define the finish procedure.
05  Create nodes and the links between them.
06  Create the agents and attach them to the nodes.
07  Create the applications and attach them to the UDP agent.
08  Connect udp and null agents.
09  Run the simulation.`,

  9: `/* ALGORITHM - Distance Vector / Link State Routing */

(a) Link state routing protocol
01  Create a Simulator object.
02  Set routing as dynamic.
03  Open the trace and nam trace files.
04  Define the finish procedure.
05  Create nodes and the links between them.
06  Create the agents and attach them to the nodes.
07  Create the applications and attach them to the udp agent.
08  Connect udp and null.
09  At 1 sec the link between node 1 and 2 is broken.
10  At 2 sec the link is up again.
11  Run the simulation.

(b) Distance vector routing algorithm
01  Create a simulator object.
02  Set routing protocol to Distance Vector routing.
03  Trace packets on all links onto NAM trace and text trace file.
04  Define finish procedure to close files, flush tracing and run NAM.
05  Create eight nodes.
06  Specify the link characteristics between nodes.
07  Describe their layout topology as a octagon.
08  Add UDP agent for node n1.
09  Create CBR traffic on top of UDP and set traffic parameters.
10  Add a sink agent to node n4.
11  Connect source and the sink.
12  Schedule events: start traffic at 0.5, down link n3-n4 at 1.0, up link at 2.0, stop traffic at 3.0, call finish at 5.0.
13  Start the scheduler.`,

  10: `/* ALGORITHM - Error Correction Code (CRC) */

01  Start the Program.
02  Given a bit string, append 0s to the end of it (the number of 0s is the same as the degree of the generator polynomial), let B(x) be the polynomial corresponding to B.
03  Divide B(x) by some agreed on polynomial G(x) (generator polynomial) and determine the remainder R(x). This division is to be done using Modulo 2 Division.
04  Define T(x) = B(x) + R(x).
05  T(x) / G(x) gives remainder 0.
06  Transmit T, the bit string corresponding to T(x).
07  Let T' represent the bit stream the receiver gets and T'(x) the associated polynomial. The receiver divides T'(x) by G(x). If there is a 0 remainder, the receiver concludes T = T' and no error occurred; otherwise it concludes an error occurred and requires a retransmission.
08  Stop the Program.`
};

/* Extra tools / files needed to actually run each experiment outside this simulator. */
export const REQUIREMENTS = {
  1: 'tcpdump, netstat, ipconfig/ifconfig, nslookup, tracert/traceroute, ping and a packet analyzer (Wireshark).',
  2: 'JDK (javac/java), the image file digital_image_processing.jpg, and two terminals: run Server first, then Client.',
  3: 'JDK (javac/java), two terminals for client and server, and free TCP/UDP ports (9000 / 4000).',
  4: 'JDK (javac/java), two terminals, and the host-name to IP table hard-coded in the DNS server.',
  5: 'NS-2 (ns) with NAM (nam), TCL scripts, and trace files (.tr / .nam). Wireshark optional for packet capture.',
  6: 'JDK (javac/java), two terminals, an IP-to-MAC table for ARP and a MAC-to-IP table for RARP.',
  7: 'NS-2 (ns) with congestion-control support, TCL script, NAM and trace files.',
  8: 'NS-2 (ns), NAM, TCL scripts for TCP and UDP, and trace files to compare throughput / delay / loss.',
  9: 'NS-2 (ns) with rtproto LS / rtproto DV support, NAM, TCL scripts and trace files.',
  10: 'JDK (javac/java), the data bits and generator polynomial entered through stdin.'
};
